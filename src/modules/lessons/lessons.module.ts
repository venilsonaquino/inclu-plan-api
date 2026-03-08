import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LessonPlanModel } from './infra/persistence/sequelize/models/lesson-plan.model';
import { StudentAdaptationModel } from './infra/persistence/sequelize/models/student-adaptation.model';
import { ILessonPlanRepository } from './domain/repositories/lesson-plan.repository.interface';
import { SequelizeLessonPlanRepository } from './infra/persistence/sequelize/sequelize-lesson-plan.repository';

@Module({
  imports: [
    SequelizeModule.forFeature([LessonPlanModel, StudentAdaptationModel]),
  ],
  providers: [
    {
      provide: ILessonPlanRepository,
      useClass: SequelizeLessonPlanRepository,
    },
  ],
  exports: [ILessonPlanRepository],
})
export class LessonsModule { }
