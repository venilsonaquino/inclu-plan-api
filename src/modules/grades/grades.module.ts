import { Module } from '@nestjs/common';
import { GradesController } from '@/modules/grades/infra/http/controllers/grades.controller';
import { CreateGradeUseCase } from '@/modules/grades/application/use-cases/create-grade/create-grade.use-case';
import { IGradesRepository } from '@/modules/grades/domain/repositories/grades.repository';
import { InMemoryGradesRepository } from '@/modules/grades/infra/persistence/in-memory/in-memory-grades.repository';

@Module({
  controllers: [GradesController],
  providers: [
    CreateGradeUseCase,
    {
      provide: IGradesRepository,
      useClass: InMemoryGradesRepository,
    },
  ],
  exports: [IGradesRepository],
})
export class GradesModule {}
