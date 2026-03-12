import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AiController } from './infra/http/ai.controller';
import { GenerateLessonUseCase } from './application/use-cases/generate-lesson/generate-lesson.use-case';
import { GenerateCardsUseCase } from './application/use-cases/generate-cards/generate-cards.use-case';
import { GenerateBoardUseCase } from './application/use-cases/generate-board/generate-board.use-case';
import { GenerateHomeworkUseCase } from './application/use-cases/generate-homework/generate-homework.use-case';
import { IAiProvider } from './domain/providers/ai-provider.interface';
import { ITemplateLoader } from './domain/providers/template-loader.interface';
import { GeminiProvider } from './infra/integrations/gemini.provider';
import { FileTemplateLoader } from './infra/providers/file-template-loader.provider';
import { IMaterialCacheRepository } from './domain/repositories/material-cache.repository.interface';
import { InMemoryMaterialCacheRepository } from './infra/persistence/in-memory/in-memory-material-cache.repository';

import { StudentsModule } from '@/modules/students/students.module';
import { GradesModule } from '@/modules/grades/grades.module';
import { NeurodivergenciesModule } from '@/modules/neurodivergencies/neurodivergencies.module';
import { LessonsModule } from '../lessons/lessons.module';
import { TeachersModule } from '@/modules/teachers/teachers.module';

@Module({
  imports: [
    StudentsModule,
    GradesModule,
    NeurodivergenciesModule,
    LessonsModule,
    TeachersModule,
  ],
  controllers: [AiController],
  providers: [
    GenerateLessonUseCase,
    GenerateCardsUseCase,
    GenerateBoardUseCase,
    GenerateHomeworkUseCase,
    {
      provide: IAiProvider,
      useClass: GeminiProvider,
    },
    {
      provide: ITemplateLoader,
      useClass: FileTemplateLoader,
    },
    {
      provide: IMaterialCacheRepository,
      useClass: InMemoryMaterialCacheRepository,
    },
  ],
})
export class AiModule { }
