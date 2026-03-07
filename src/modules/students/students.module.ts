import { Module } from '@nestjs/common';
import { StudentsController } from '@/modules/students/infra/http/controllers/students.controller';
import { CreateStudentUseCase } from '@/modules/students/application/use-cases/create-student/create-student.use-case';
import { IStudentsRepository } from '@/modules/students/domain/repositories/students.repository';
import { SequelizeStudentsRepository } from '@/modules/students/infra/persistence/sequelize/repositories/sequelize-students.repository';
import { StudentModel } from '@/modules/students/infra/persistence/sequelize/models/student.model';
import { NeurodivergencyModel } from '@/modules/neurodivergencies/infra/persistence/sequelize/models/neurodivergency.model';
import { StudentNeurodivergencyModel } from '@/modules/student-neurodivergencies/infra/persistence/sequelize/models/student-neurodivergency.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([StudentModel, NeurodivergencyModel, StudentNeurodivergencyModel])],
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
export class StudentsModule {}
