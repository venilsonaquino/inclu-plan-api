import { Module } from '@nestjs/common';
import { StudentLearningProfilesController } from '@/modules/student-learning-profiles/infra/http/controllers/student-learning-profiles.controller';
import { AssignProfileToStudentUseCase } from '@/modules/student-learning-profiles/application/use-cases/assign-profile-to-student/assign-profile-to-student.use-case';
import { IStudentLearningProfilesRepository } from '@/modules/student-learning-profiles/domain/repositories/student-learning-profiles.repository';
import { SequelizeStudentLearningProfilesRepository } from '@/modules/student-learning-profiles/infra/persistence/sequelize/repositories/sequelize-student-learning-profiles.repository';
import { StudentLearningProfileModel } from '@/modules/student-learning-profiles/infra/persistence/sequelize/models/student-learning-profile.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([StudentLearningProfileModel])],
  controllers: [StudentLearningProfilesController],
  providers: [
    AssignProfileToStudentUseCase,
    {
      provide: IStudentLearningProfilesRepository,
      useClass: SequelizeStudentLearningProfilesRepository,
    },
  ],
  exports: [IStudentLearningProfilesRepository],
})
export class StudentLearningProfilesModule {}
