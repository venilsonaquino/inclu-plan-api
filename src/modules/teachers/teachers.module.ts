import { Module } from '@nestjs/common';
import { TeachersController } from '@/modules/teachers/infra/http/controllers/teachers.controller';
import { CreateTeacherUseCase } from '@/modules/teachers/application/use-cases/create-teacher/create-teacher.use-case';
import { ITeachersRepository } from '@/modules/teachers/domain/repositories/teachers.repository';
import { SequelizeTeachersRepository } from '@/modules/teachers/infra/persistence/sequelize/repositories/sequelize-teachers.repository';
import { TeacherModel } from '@/modules/teachers/infra/persistence/sequelize/models/teacher.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([TeacherModel])],
  controllers: [TeachersController],
  providers: [
    CreateTeacherUseCase,
    {
      provide: ITeachersRepository,
      useClass: SequelizeTeachersRepository,
    },
  ],
  exports: [ITeachersRepository],
})
export class TeachersModule {}
