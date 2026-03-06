import { Module } from '@nestjs/common';
import { LearningProfilesController } from '@/modules/learning-profiles/infra/http/controllers/learning-profiles.controller';
import { CreateLearningProfileUseCase } from '@/modules/learning-profiles/application/use-cases/create-learning-profile/create-learning-profile.use-case';
import { ILearningProfilesRepository } from '@/modules/learning-profiles/domain/repositories/learning-profiles.repository';
import { InMemoryLearningProfilesRepository } from '@/modules/learning-profiles/infra/persistence/in-memory/in-memory-learning-profiles.repository';

@Module({
  controllers: [LearningProfilesController],
  providers: [
    CreateLearningProfileUseCase,
    {
      provide: ILearningProfilesRepository,
      useClass: InMemoryLearningProfilesRepository,
    },
  ],
  exports: [ILearningProfilesRepository],
})
export class LearningProfilesModule {}
