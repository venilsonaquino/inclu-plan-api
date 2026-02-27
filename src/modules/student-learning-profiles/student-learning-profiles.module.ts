import { Module } from '@nestjs/common';
import { StudentLearningProfilesController } from '@/modules/student-learning-profiles/infra/http/controllers/student-learning-profiles.controller';
import { AssignProfileToStudentUseCase } from '@/modules/student-learning-profiles/application/use-cases/assign-profile-to-student/assign-profile-to-student.use-case';
import { IStudentLearningProfilesRepository } from '@/modules/student-learning-profiles/domain/repositories/student-learning-profiles.repository';
import { InMemoryStudentLearningProfilesRepository } from '@/modules/student-learning-profiles/infra/persistence/in-memory/in-memory-student-learning-profiles.repository';

@Module({
  controllers: [StudentLearningProfilesController],
  providers: [
    AssignProfileToStudentUseCase,
    {
      provide: IStudentLearningProfilesRepository,
      useClass: InMemoryStudentLearningProfilesRepository,
    },
  ],
  exports: [IStudentLearningProfilesRepository]
})
export class StudentLearningProfilesModule { }
