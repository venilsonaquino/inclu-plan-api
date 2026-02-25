import { Module } from '@nestjs/common';
import { AiController } from './infra/http/ai.controller';
import { GenerateLessonUseCase } from './application/use-cases/generate-lesson/generate-lesson.use-case';
import { GenerateMaterialUseCase } from './application/use-cases/generate-material/generate-material.use-case';
import { GeminiProvider } from './infra/integrations/gemini.provider';

@Module({
  controllers: [AiController],
  providers: [
    GenerateLessonUseCase,
    GenerateMaterialUseCase,
    GeminiProvider,
  ],
})
export class AiModule { }
