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
import { ILessonPlanRepository } from '@/modules/lessons/domain/repositories/lesson-plan.repository.interface';
import { LessonPlan } from '@/modules/lessons/domain/entities/lesson-plan.entity';
import { GenerateLessonMapper } from './generate-lesson.mapper';
import { UseCase } from '@/shared/domain/interfaces/use-case';
import { ITeachersRepository } from '@/modules/teachers/domain/repositories/teachers.repository';

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
    private readonly teachersRepository: ITeachersRepository,
  ) { }

  async execute(payload: GenerateLessonInput): Promise<Result<ILessonGenerationBatchResponse>> {
    try {
      if (!payload.userId) {
        return Result.fail('User ID is required to generate a lesson plan.');
      }

      const teacher = await this.teachersRepository.findByUserId(payload.userId);
      if (!teacher) {
        return Result.fail('Teacher record not found.');
      }

      payload.teacherId = teacher.id;

      this.logger.log(`Step 1/4: Loading templates and pedagogical context...`);
      const [templates, context] = await Promise.all([
        this.loadTemplates(),
        this.getStudentContext(payload),
      ]);

      this.logger.log(`Step 2/4: Building specialized batch prompt...`);
      const fullUserPrompt = this.prepareBatchPrompt(payload, templates.userBase, context);

      this.logger.log(`Step 3/4: Calling AI Provider for batch generation...`);
      const aiResponse = (await this.aiProvider.generateText(
        templates.system,
        fullUserPrompt,
        payload.imagePart,
      )) as ILessonGenerationBatchResponse;

      if (!aiResponse || !Array.isArray(aiResponse.disciplines)) {
        this.logger.error(`Invalid AI response structure. Received: ${JSON.stringify(aiResponse)}`);
        return Result.fail<ILessonGenerationBatchResponse>(
          `AI returned an unexpected format. Expected { disciplines: [...] }.`
        );
      }

      this.logger.log(`Step 4/4: Persisting results for ${aiResponse.disciplines.length} disciplines to database...`);
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
    const lessonPlans: LessonPlan[] = [];
    const context = await this.getStudentContext(payload);

    payload.lessons.forEach((lessonReq, discIndex) => {
      const aiDiscipline = aiResponse.disciplines.find(d => d.name === lessonReq.discipline.name) || aiResponse.disciplines[discIndex];

      if (!aiDiscipline) {
        this.logger.warn(`No AI discipline found for ${lessonReq.discipline.name}. Skipping.`);
        return;
      }

      const disciplinePlans = aiDiscipline.lessons.map(aiLesson =>
        GenerateLessonMapper.mapAiLessonToAggregate(payload.teacherId, lessonReq, aiDiscipline, aiLesson, context.studentMap)
      );

      lessonPlans.push(...disciplinePlans);
    });

    if (lessonPlans.length > 0) {
      await this.lessonPlanRepository.saveBatch(lessonPlans);
    } else {
      this.logger.warn('No valid lesson plans to persist after processing AI response.');
    }
  }
}
