import { Injectable, Logger } from '@nestjs/common';
import { IAiProvider } from '@/modules/ai/domain/providers/ai-provider.interface';
import { ITemplateLoader } from '@/modules/ai/domain/providers/template-loader.interface';
import { Result } from '@/shared/domain/utils/result';
import { GenerateLessonInput } from './generate-lesson.input';
import { Student } from '@/modules/students/domain/entities/student.entity';
import { IStudentsRepository } from '@/modules/students/domain/repositories/students.repository';
import { IGradesRepository } from '@/modules/grades/domain/repositories/grades.repository';
import { INeurodivergenciesRepository } from '@/modules/neurodivergencies/domain/repositories/neurodivergencies.repository';
import { LessonPromptBuilder } from '@/modules/ai/domain/services/lesson-prompt-builder';
import { ILessonGenerationBatchResponse } from '@/modules/ai/domain/interfaces/lesson-generation-response.interface';
import { ILessonPlanRepository } from '@/modules/ai/domain/repositories/lesson-plan.repository.interface';
import { randomUUID } from 'node:crypto';
import { UseCase } from '@/shared/domain/interfaces/use-case';

@Injectable()
export class GenerateLessonUseCase implements UseCase<GenerateLessonInput, ILessonGenerationBatchResponse> {
  private readonly logger = new Logger(GenerateLessonUseCase.name);

  constructor(
    private readonly aiProvider: IAiProvider,
    private readonly templateLoader: ITemplateLoader,
    private readonly lessonPlanRepository: ILessonPlanRepository,
    private readonly studentsRepository: IStudentsRepository,
    private readonly gradesRepository: IGradesRepository,
    private readonly neurodivergenciesRepository: INeurodivergenciesRepository,
  ) { }

  async execute(payload: GenerateLessonInput): Promise<Result<ILessonGenerationBatchResponse>> {
    try {
      this.logger.log(`Step 1/4: Loading templates and pedagogical context...`);
      const [templates, context] = await Promise.all([
        this.loadTemplates(),
        this.getStudentContext(payload),
      ]);

      this.logger.log(`Step 2/4: Building specialized batch prompt...`);
      const fullUserPrompt = this.prepareBatchPrompt(payload, templates.userBase, context);

      this.logger.log(`Step 3/4: Calling AI Provider for ${payload.lessons.length} lessons...`);
      const aiResponse = (await this.aiProvider.generateText(
        templates.system,
        fullUserPrompt,
        payload.imagePart,
      )) as ILessonGenerationBatchResponse;

      if (!aiResponse || !Array.isArray(aiResponse.lessons)) {
        this.logger.error(`Invalid AI response structure. Received: ${JSON.stringify(aiResponse)}`);
        throw new Error(`AI returned an unexpected format. Expected { lessons: [...] }.`);
      }

      this.logger.log(`Step 4/4: Persisting ${aiResponse.lessons.length} results to database...`);
      await this.persistResults(payload, aiResponse);

      return Result.ok<ILessonGenerationBatchResponse>(aiResponse);
    } catch (error) {
      this.logger.error('Failed to generate lessons flow', error);
      return Result.fail<ILessonGenerationBatchResponse>(
        error instanceof Error ? error.message : 'Unknown error in generation pipeline',
      );
    }
  }

  private async loadTemplates() {
    const [system, userBase] = await Promise.all([
      this.templateLoader.load('generate-lesson/prompts/generate-lesson.system.md'),
      this.templateLoader.load('generate-lesson/prompts/generate-lesson.user.md'),
    ]);
    return { system, userBase };
  }

  private async getStudentContext(payload: GenerateLessonInput) {
    const allStudentIds = [...new Set(payload.lessons.flatMap(l => l.students))];
    const students = await this.studentsRepository.findByIds(allStudentIds);
    const studentMap = new Map(students.map(s => [s.id, s]));

    const gradeIds = [...new Set(students.map(s => s.gradeId))];
    const neuroIds = [...new Set(students.flatMap(s => s.neurodivergencies))];

    const [grades, neuros] = await Promise.all([
      this.gradesRepository.findByIds(gradeIds),
      this.neurodivergenciesRepository.findByIds(neuroIds),
    ]);

    return {
      studentMap,
      gradeMap: new Map(grades.map(g => [g.id, g.name])),
      neuroMap: new Map(neuros.map(n => [n.id, n.name])),
    };
  }

  private prepareBatchPrompt(
    payload: GenerateLessonInput,
    userTemplate: string,
    context: { studentMap: Map<string, Student>; gradeMap: Map<string, string>; neuroMap: Map<string, string> },
  ): string {
    const requestedLessons = payload.lessons.map(lessonReq => {
      const { name, theme, observations } = lessonReq.discipline;
      const lessonStudents = lessonReq.students.map(id => context.studentMap.get(id)).filter(Boolean);

      return {
        discipline: name,
        theme,
        observations,
        students: lessonStudents,
      };
    });

    const batchString = LessonPromptBuilder.buildBatchPrompt(
      requestedLessons,
      context.gradeMap,
      context.neuroMap,
    );

    return userTemplate.replace('{{LESSONS_BATCH_STR}}', batchString);
  }

  private async persistResults(payload: GenerateLessonInput, aiResponse: ILessonGenerationBatchResponse): Promise<void> {
    const records: any[] = payload.lessons.flatMap((lessonReq, lessonIndex) => {
      const aiLesson = aiResponse.lessons[lessonIndex];
      if (!aiLesson) {
        this.logger.warn(`No AI lesson found at index ${lessonIndex}. Skipping.`);
        return [];
      }

      const adaptations = Array.isArray(aiLesson.adaptations) ? aiLesson.adaptations : [];
      if (adaptations.length === 0) {
        this.logger.warn(`Lesson at index ${lessonIndex} has no adaptations array. AI lesson data: ${JSON.stringify(aiLesson)}`);
      }

      return lessonReq.students.map((studentId, studentIndex) => {
        const adaptation = adaptations[studentIndex];
        if (!adaptation) {
          this.logger.warn(`No adaptation found for studentId=${studentId} at index ${studentIndex} in lesson ${lessonIndex}. Skipping.`);
          return null;
        }

        return {
          id: randomUUID(),
          teacherId: payload.teacherId,
          studentId: studentId,
          discipline: lessonReq.discipline.name,
          theme: lessonReq.discipline.theme,
          lessonResult: aiLesson,
          adaptationDetails: {
            strategy: adaptation.strategy,
            behavioral_tips: adaptation.behavioral_tips,
          },
        };
      });
    }).filter(Boolean);

    if (records.length > 0) {
      await this.lessonPlanRepository.saveBatch(records);
    } else {
      this.logger.warn('No valid records to persist after processing AI response.');
    }
  }
}
