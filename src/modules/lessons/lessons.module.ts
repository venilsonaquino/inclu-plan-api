import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LessonPlanModel } from './infra/persistence/sequelize/models/lesson-plan.model';
import { StudentAdaptationModel } from './infra/persistence/sequelize/models/student-adaptation.model';
import { ILessonPlanRepository } from './domain/repositories/lesson-plan.repository.interface';
import { SequelizeLessonPlanRepository } from './infra/persistence/sequelize/sequelize-lesson-plan.repository';
import { LessonsController } from './infra/http/controllers/lessons.controller';
import { ListLessonPlansUseCase } from './application/use-cases/list-lesson-plans/list-lesson-plans.use-case';
import { GetLessonPlanUseCase } from './application/use-cases/get-lesson-plan/get-lesson-plan.use-case';
import { TeachersModule } from '@/modules/teachers/teachers.module';

@Module({
  imports: [
    SequelizeModule.forFeature([LessonPlanModel, StudentAdaptationModel]),
    TeachersModule,
  ],
  controllers: [LessonsController],
  providers: [
    {
      provide: ILessonPlanRepository,
      useClass: SequelizeLessonPlanRepository,
    },
    ListLessonPlansUseCase,
    GetLessonPlanUseCase,
  ],
  exports: [ILessonPlanRepository],
})
export class LessonsModule { }


