import { Module } from '@nestjs/common';
import { SchoolClassesController } from '@/modules/school-classes/infra/http/controllers/school-classes.controller';
import { CreateSchoolClassUseCase } from '@/modules/school-classes/application/use-cases/create-school-class/create-school-class.use-case';
import { ISchoolClassesRepository } from '@/modules/school-classes/domain/repositories/school-classes.repository';
import { InMemorySchoolClassesRepository } from '@/modules/school-classes/infra/persistence/in-memory/in-memory-school-classes.repository';

@Module({
  controllers: [SchoolClassesController],
  providers: [
    CreateSchoolClassUseCase,
    {
      provide: ISchoolClassesRepository,
      useClass: InMemorySchoolClassesRepository,
    },
  ],
  exports: [ISchoolClassesRepository]
})
export class SchoolClassesModule { }
