import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AiController } from './infra/http/ai.controller';
import { GenerateLessonUseCase } from './application/use-cases/generate-lesson/generate-lesson.use-case';
import { GenerateCardsUseCase } from './application/use-cases/generate-cards/generate-cards.use-case';
import { GenerateBoardUseCase } from './application/use-cases/generate-board/generate-board.use-case';
import { GenerateHomeworkUseCase } from './application/use-cases/generate-homework/generate-homework.use-case';
import { GeminiProvider } from './infra/integrations/gemini.provider';
import { I_AI_PROVIDER } from './domain/providers/ai-provider.interface';
import { I_TEMPLATE_LOADER } from './domain/providers/template-loader.interface';
import { FileTemplateLoader } from './infra/providers/file-template-loader.provider';
import { LessonPlanModel } from './infra/persistence/sequelize/models/lesson-plan.model';
import { I_MATERIAL_CACHE_REPOSITORY } from '@/modules/ai/domain/repositories/material-cache.repository.interface';
import { InMemoryMaterialCacheRepository } from '@/modules/ai/infra/persistence/in-memory/in-memory-material-cache.repository';
import { I_LESSON_PLAN_REPOSITORY } from './domain/repositories/lesson-plan.repository.interface';
import { SequelizeLessonPlanRepository } from './infra/persistence/sequelize/sequelize-lesson-plan.repository';

import { StudentsModule } from '@/modules/students/students.module';
import { GradesModule } from '@/modules/grades/grades.module';
import { NeurodivergenciesModule } from '@/modules/neurodivergencies/neurodivergencies.module';

@Module({
  imports: [
    SequelizeModule.forFeature([LessonPlanModel]),
    StudentsModule,
    GradesModule,
    NeurodivergenciesModule,
  ],
  controllers: [AiController],
  providers: [
    GenerateLessonUseCase,
    GenerateCardsUseCase,
    GenerateBoardUseCase,
    GenerateHomeworkUseCase,
    {
      provide: I_AI_PROVIDER,
      useClass: GeminiProvider,
    },
    {
      provide: I_TEMPLATE_LOADER,
      useClass: FileTemplateLoader,
    },
    {
      provide: I_MATERIAL_CACHE_REPOSITORY,
      useClass: InMemoryMaterialCacheRepository,
    },
    {
      provide: I_LESSON_PLAN_REPOSITORY,
      useClass: SequelizeLessonPlanRepository,
    },
  ],
})
export class AiModule { }
