import { Module } from '@nestjs/common';
import { SchoolClassesController } from '@/modules/school-classes/infra/http/controllers/school-classes.controller';
import { CreateSchoolClassUseCase } from '@/modules/school-classes/application/use-cases/create-school-class/create-school-class.use-case';
import { ListSchoolClassesByTeacherUseCase } from '@/modules/school-classes/application/use-cases/list-school-classes-by-teacher/list-school-classes-by-teacher.use-case';
import { GetSchoolClassUseCase } from '@/modules/school-classes/application/use-cases/get-school-class/get-school-class.use-case';
import { ISchoolClassesRepository } from '@/modules/school-classes/domain/repositories/school-classes.repository';
import { SequelizeSchoolClassesRepository } from '@/modules/school-classes/infra/persistence/sequelize/repositories/sequelize-school-classes.repository';
import { SchoolClassModel } from '@/modules/school-classes/infra/persistence/sequelize/models/school-class.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { TeachersModule } from '@/modules/teachers/teachers.module';

@Module({
  imports: [
    SequelizeModule.forFeature([SchoolClassModel]),
    TeachersModule,
  ],
  controllers: [SchoolClassesController],
  providers: [
    CreateSchoolClassUseCase,
    ListSchoolClassesByTeacherUseCase,
    GetSchoolClassUseCase,
    {
      provide: ISchoolClassesRepository,
      useClass: SequelizeSchoolClassesRepository,
    },
  ],
  exports: [ISchoolClassesRepository],
})
export class SchoolClassesModule {}
