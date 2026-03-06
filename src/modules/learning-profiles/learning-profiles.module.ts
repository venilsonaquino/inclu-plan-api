import { Module } from '@nestjs/common';
import { LearningProfilesController } from '@/modules/learning-profiles/infra/http/controllers/learning-profiles.controller';
import { CreateLearningProfileUseCase } from '@/modules/learning-profiles/application/use-cases/create-learning-profile/create-learning-profile.use-case';
import { ILearningProfilesRepository } from '@/modules/learning-profiles/domain/repositories/learning-profiles.repository';
import { SequelizeLearningProfilesRepository } from '@/modules/learning-profiles/infra/persistence/sequelize/repositories/sequelize-learning-profiles.repository';
import { LearningProfileModel } from '@/modules/learning-profiles/infra/persistence/sequelize/models/learning-profile.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([LearningProfileModel])],
  controllers: [LearningProfilesController],
  providers: [
    CreateLearningProfileUseCase,
    {
      provide: ILearningProfilesRepository,
      useClass: SequelizeLearningProfilesRepository,
    },
  ],
  exports: [ILearningProfilesRepository],
})
export class LearningProfilesModule {}
