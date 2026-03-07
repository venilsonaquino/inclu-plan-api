import { Module } from '@nestjs/common';
import { SchoolClassesController } from '@/modules/school-classes/infra/http/controllers/school-classes.controller';
import { CreateSchoolClassUseCase } from '@/modules/school-classes/application/use-cases/create-school-class/create-school-class.use-case';
import { ISchoolClassesRepository } from '@/modules/school-classes/domain/repositories/school-classes.repository';
import { SequelizeSchoolClassesRepository } from '@/modules/school-classes/infra/persistence/sequelize/repositories/sequelize-school-classes.repository';
import { SchoolClassModel } from '@/modules/school-classes/infra/persistence/sequelize/models/school-class.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([SchoolClassModel])],
  controllers: [SchoolClassesController],
  providers: [
    CreateSchoolClassUseCase,
    {
      provide: ISchoolClassesRepository,
      useClass: SequelizeSchoolClassesRepository,
    },
  ],
  exports: [ISchoolClassesRepository],
})
export class SchoolClassesModule {}
