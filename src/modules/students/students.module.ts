import { Module } from '@nestjs/common';
import { StudentsController } from '@/modules/students/infra/http/controllers/students.controller';
import { CreateStudentUseCase } from '@/modules/students/application/use-cases/create-student/create-student.use-case';
import { IStudentsRepository } from '@/modules/students/domain/repositories/students.repository';
import { InMemoryStudentsRepository } from '@/modules/students/infra/persistence/in-memory/in-memory-students.repository';

@Module({
  controllers: [StudentsController],
  providers: [
    CreateStudentUseCase,
    {
      provide: IStudentsRepository,
      useClass: InMemoryStudentsRepository,
    },
  ],
  exports: [IStudentsRepository],
})
export class StudentsModule {}
