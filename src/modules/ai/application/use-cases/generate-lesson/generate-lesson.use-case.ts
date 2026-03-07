import { Injectable, Logger, Inject } from '@nestjs/common';
import { I_AI_PROVIDER, IAiProvider } from '@/modules/ai/domain/providers/ai-provider.interface';
import { I_TEMPLATE_LOADER, ITemplateLoader } from '@/modules/ai/domain/providers/template-loader.interface';
import { Result } from '@/shared/domain/utils/result';
import { GenerateLessonInput } from './generate-lesson.input';
import { Student } from '@/modules/students/domain/entities/student.entity';
import { IStudentsRepository } from '@/modules/students/domain/repositories/students.repository';
import { IGradesRepository } from '@/modules/grades/domain/repositories/grades.repository';
import { INeurodivergenciesRepository } from '@/modules/neurodivergencies/domain/repositories/neurodivergencies.repository';
import { LessonPromptBuilder } from '@/modules/ai/domain/services/lesson-prompt-builder';
import { RawAiBatchResponse } from './raw-ai-response.interface';

@Injectable()
export class GenerateLessonUseCase {
  private readonly logger = new Logger(GenerateLessonUseCase.name);

  constructor(
    @Inject(I_AI_PROVIDER) private readonly aiProvider: IAiProvider,
    @Inject(I_TEMPLATE_LOADER) private readonly templateLoader: ITemplateLoader,
    private readonly studentsRepository: IStudentsRepository,
    private readonly gradesRepository: IGradesRepository,
    private readonly neurodivergenciesRepository: INeurodivergenciesRepository,
  ) { }

  async execute(payload: GenerateLessonInput): Promise<Result<RawAiBatchResponse>> {
    try {
      this.logger.log(`Processing ${payload.lessons.length} lesson(s) for teacher ${payload.teacherId}...`);

      const systemInstruction = await this.templateLoader.load('generate-lesson/prompts/generate-lesson.system.md');

      const allStudentIds = [...new Set(payload.lessons.flatMap(l => l.students))];
      const students = await this.studentsRepository.findByIds(allStudentIds);
      const studentMap = new Map(students.map(s => [s.id, s]));

      const gradeIds = [...new Set(students.map(s => s.gradeId))];
      const neuroIds = [...new Set(students.flatMap(s => s.neurodivergencies))];

      const [grades, neuros] = await Promise.all([
        this.gradesRepository.findByIds(gradeIds),
        this.neurodivergenciesRepository.findByIds(neuroIds),
      ]);

      const gradeMap = new Map(grades.map(g => [g.id, g.name]));
      const neuroMap = new Map(neuros.map(n => [n.id, n.name]));

      const requestedLessons = payload.lessons.map(lessonReq => {
        const { name: disciplineName, theme, observations } = lessonReq.discipline;
        const lessonStudents = lessonReq.students.map(id => studentMap.get(id)).filter(Boolean) as Student[];
        return {
          discipline: { name: disciplineName, theme },
          observations,
          students: lessonStudents,
        };
      });

      const lessonsBatchString = LessonPromptBuilder.buildBatchPrompt(
        requestedLessons.map(l => ({
          discipline: l.discipline.name,
          theme: l.discipline.theme,
          observations: l.observations,
          students: l.students,
        })),
        gradeMap,
        neuroMap,
      );

      let promptText = await this.templateLoader.load('generate-lesson/prompts/generate-lesson.user.md');
      promptText = promptText.replace('{{LESSONS_BATCH_STR}}', lessonsBatchString);

      console.log(promptText);
      console.log(systemInstruction);

      const aiResponse = (await this.aiProvider.generateText(systemInstruction, promptText, payload.imagePart)) as RawAiBatchResponse;

      return Result.ok<RawAiBatchResponse>(aiResponse);
    } catch (error) {
      this.logger.error('Failed to generate lessons', error);
      return Result.fail<RawAiBatchResponse>(
        error instanceof Error ? error.message : 'Unknown error generating lessons',
      );
    }
  }
}
