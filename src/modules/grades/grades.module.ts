import { Module } from '@nestjs/common';
import { SequelizeGradesRepository } from '@/modules/grades/infra/persistence/sequelize/repositories/sequelize-grades.repository';
import { GradeModel } from '@/modules/grades/infra/persistence/sequelize/models/grade.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { GradesController } from '@/modules/grades/infra/http/controllers/grades.controller';
import { CreateGradeUseCase } from '@/modules/grades/application/use-cases/create-grade/create-grade.use-case';
import { IGradesRepository } from '@/modules/grades/domain/repositories/grades.repository';
import { ListGradesUseCase } from '@/modules/grades/application/use-cases/list-grades/list-grades.use-case';

@Module({
  imports: [SequelizeModule.forFeature([GradeModel])],
  controllers: [GradesController],
  providers: [
    CreateGradeUseCase,
    ListGradesUseCase,
    {
      provide: IGradesRepository,
      useClass: SequelizeGradesRepository,
    },
  ],
  exports: [IGradesRepository],
})
export class GradesModule {}
