import { Module } from '@nestjs/common';
import { TeachersController } from '@/modules/teachers/infra/http/controllers/teachers.controller';
import { CreateTeacherUseCase } from '@/modules/teachers/application/use-cases/create-teacher/create-teacher.use-case';
import { ITeachersRepository } from '@/modules/teachers/domain/repositories/teachers.repository';
import { InMemoryTeachersRepository } from '@/modules/teachers/infra/persistence/in-memory/in-memory-teachers.repository';

@Module({
  controllers: [TeachersController],
  providers: [
    CreateTeacherUseCase,
    {
      provide: ITeachersRepository,
      useClass: InMemoryTeachersRepository,
    },
  ],
  exports: [ITeachersRepository]
})
export class TeachersModule { }
