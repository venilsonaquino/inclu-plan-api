import { Injectable, Logger } from '@nestjs/common';
import { GeminiProvider } from '@/modules/ai/infra/integrations/gemini.provider';
import { Result } from '@/shared/domain/utils/result';
import { GenerateLessonInput } from './generate-lesson.input';
import { GenerateLessonOutput } from './generate-lesson.output';
import { PromptUtil } from '../../utils/prompt.util';
import { LessonStudents } from '@/modules/ai/domain/value-objects/lesson-students.vo';
import { LessonSchedule } from '@/modules/ai/domain/value-objects/lesson-schedule.vo';

@Injectable()
export class GenerateLessonUseCase {
  private readonly logger = new Logger(GenerateLessonUseCase.name);

  constructor(private readonly geminiProvider: GeminiProvider) { }

  async execute(
    payload: GenerateLessonInput,
  ): Promise<Result<GenerateLessonOutput>> {
    try {
      const studentsVo = LessonStudents.create(payload.students);
      const scheduleVo = LessonSchedule.create(payload.days);

      const studentsString = studentsVo.toPromptString();
      const contentsString = scheduleVo.toPromptString();

      this.logger.log('Generating lesson via Gemini LLM...');

      const systemInstruction = PromptUtil.loadPromptTemplate(__dirname, 'generate-lesson.system.md');
      let promptText = PromptUtil.loadPromptTemplate(__dirname, 'generate-lesson.user.md');

      promptText = promptText
        .replace('{{STUDENTS_STR}}', studentsString)
        .replace('{{CONTENTS_STR}}', contentsString);

      const aiResponse = await this.geminiProvider.generateText(
        systemInstruction,
        promptText,
        payload.imagePart,
      );

      return Result.ok<GenerateLessonOutput>(
        aiResponse as GenerateLessonOutput,
      );
    } catch (error) {
      this.logger.error('Failed to generate lesson', error);
      return Result.fail<GenerateLessonOutput>(
        error instanceof Error
          ? error.message
          : 'Unknown error generating lesson',
      );
    }
  }
}
