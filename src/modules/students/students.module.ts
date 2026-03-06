import { Module } from '@nestjs/common';
import { StudentsController } from '@/modules/students/infra/http/controllers/students.controller';
import { CreateStudentUseCase } from '@/modules/students/application/use-cases/create-student/create-student.use-case';
import { IStudentsRepository } from '@/modules/students/domain/repositories/students.repository';
import { SequelizeStudentsRepository } from '@/modules/students/infra/persistence/sequelize/repositories/sequelize-students.repository';
import { StudentModel } from '@/modules/students/infra/persistence/sequelize/models/student.model';
import { LearningProfileModel } from '@/modules/learning-profiles/infra/persistence/sequelize/models/learning-profile.model';
import { StudentLearningProfileModel } from '@/modules/student-learning-profiles/infra/persistence/sequelize/models/student-learning-profile.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forFeature([
      StudentModel,
      LearningProfileModel,
      StudentLearningProfileModel,
    ]),
  ],
  controllers: [StudentsController],
  providers: [
    CreateStudentUseCase,
    {
      provide: IStudentsRepository,
      useClass: SequelizeStudentsRepository,
    },
  ],
  exports: [IStudentsRepository],
})
export class StudentsModule { }
