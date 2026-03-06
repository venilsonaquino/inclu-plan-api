import { Module } from '@nestjs/common';
import { SequelizeGradesRepository } from '@/modules/grades/infra/persistence/sequelize/repositories/sequelize-grades.repository';
import { GradeModel } from '@/modules/grades/infra/persistence/sequelize/models/grade.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { GradesController } from '@/modules/grades/infra/http/controllers/grades.controller';
import { CreateGradeUseCase } from '@/modules/grades/application/use-cases/create-grade/create-grade.use-case';
import { IGradesRepository } from '@/modules/grades/domain/repositories/grades.repository';

@Module({
  imports: [SequelizeModule.forFeature([GradeModel])],
  controllers: [GradesController],
  providers: [
    CreateGradeUseCase,
    {
      provide: IGradesRepository,
      useClass: SequelizeGradesRepository,
    },
  ],
  exports: [IGradesRepository],
})
export class GradesModule { }
