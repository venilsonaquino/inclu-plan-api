import { Module } from '@nestjs/common';
import { AiController } from './infra/http/ai.controller';
import { GenerateLessonUseCase } from './application/use-cases/generate-lesson/generate-lesson.use-case';
import { GenerateCardsUseCase } from './application/use-cases/generate-cards/generate-cards.use-case';
import { GenerateBoardUseCase } from './application/use-cases/generate-board/generate-board.use-case';
import { GenerateHomeworkUseCase } from './application/use-cases/generate-homework/generate-homework.use-case';
import { GeminiProvider } from './infra/integrations/gemini.provider';
import { I_LESSON_PLAN_REPOSITORY } from './domain/repositories/lesson-plan.repository.interface';
import { InMemoryLessonPlanRepository } from './infra/persistence/in-memory/in-memory-lesson-plan.repository';

import { I_MATERIAL_CACHE_REPOSITORY } from './domain/repositories/material-cache.repository.interface';
import { InMemoryMaterialCacheRepository } from './infra/persistence/in-memory/in-memory-material-cache.repository';

@Module({
  controllers: [AiController],
  providers: [
    GenerateLessonUseCase,
    GenerateCardsUseCase,
    GenerateBoardUseCase,
    GenerateHomeworkUseCase,
    GeminiProvider,
    {
      provide: I_LESSON_PLAN_REPOSITORY,
      useClass: InMemoryLessonPlanRepository,
    },
    {
      provide: I_MATERIAL_CACHE_REPOSITORY,
      useClass: InMemoryMaterialCacheRepository,
    },
  ],
})
export class AiModule {}
