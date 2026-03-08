import { Injectable } from '@nestjs/common';
import { ILessonPlanRepository } from '@/modules/lessons/domain/repositories/lesson-plan.repository.interface';
import { LessonPlan, StudentAdaptation } from '@/modules/lessons/domain/entities/lesson-plan.entity';
import { LessonPlanModel } from './models/lesson-plan.model';
import { StudentAdaptationModel } from './models/student-adaptation.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class SequelizeLessonPlanRepository implements ILessonPlanRepository {
  constructor(private readonly sequelize: Sequelize) { }

  async save(lessonPlan: LessonPlan): Promise<void> {
    await this.sequelize.transaction(async (t) => {
      await LessonPlanModel.upsert({
        id: lessonPlan.id,
        teacherId: lessonPlan.teacherId,
        discipline: lessonPlan.discipline,
        theme: lessonPlan.theme,
        lessonTitle: lessonPlan.lessonTitle,
        estimatedPrepTime: lessonPlan.estimatedPrepTime,
        lessonNumber: lessonPlan.lessonNumber,
        objective: lessonPlan.objective,
        learningObjects: lessonPlan.learningObjects,
        bnccCode: lessonPlan.bnccCode,
        bnccDescription: lessonPlan.bnccDescription,
        duration: lessonPlan.duration,
        activitySteps: lessonPlan.activitySteps,
        udlRepresentation: lessonPlan.udlRepresentation,
        udlActionExpression: lessonPlan.udlActionExpression,
        udlEngagement: lessonPlan.udlEngagement,
        resources: lessonPlan.resources,
        evaluation: lessonPlan.evaluation,
      }, { transaction: t });

      await StudentAdaptationModel.destroy({
        where: { lessonPlanId: lessonPlan.id },
        transaction: t
      });

      if (lessonPlan.adaptations.length > 0) {
        const adaptationsData = lessonPlan.adaptations.map(a => ({
          id: a.id,
          lessonPlanId: lessonPlan.id,
          studentId: a.studentId,
          studentName: a.studentName,
          studentGrade: a.studentGrade,
          studentNeurodivergencies: a.studentNeurodivergencies,
          strategy: a.strategy,
          behavioralTips: a.behavioralTips,
          supportLevel: a.supportLevel,
          successIndicators: a.successIndicators,
        }));
        await StudentAdaptationModel.bulkCreate(adaptationsData, { transaction: t });
      }
    });
  }

  async saveBatch(lessonPlans: LessonPlan[]): Promise<void> {
    for (const plan of lessonPlans) {
      await this.save(plan);
    }
  }

  async findById(id: string): Promise<LessonPlan | null> {
    const model = await LessonPlanModel.findByPk(id, {
      include: [StudentAdaptationModel]
    });

    if (!model) return null;

    return LessonPlan.create({
      teacherId: model.teacherId,
      discipline: model.discipline,
      theme: model.theme,
      lessonTitle: model.lessonTitle,
      estimatedPrepTime: model.estimatedPrepTime,
      lessonNumber: model.lessonNumber,
      objective: model.objective,
      learningObjects: model.learningObjects,
      bnccCode: model.bnccCode,
      bnccDescription: model.bnccDescription,
      duration: model.duration,
      activitySteps: model.activitySteps,
      udlRepresentation: model.udlRepresentation,
      udlActionExpression: model.udlActionExpression,
      udlEngagement: model.udlEngagement,
      resources: model.resources,
      evaluation: model.evaluation,
      adaptations: (model as any).studentAdaptations?.map((a: any) =>
        StudentAdaptation.create({
          studentId: a.studentId,
          studentName: a.studentName,
          studentGrade: a.studentGrade,
          studentNeurodivergencies: a.studentNeurodivergencies,
          strategy: a.strategy,
          behavioralTips: a.behavioralTips,
          supportLevel: a.supportLevel,
          successIndicators: a.successIndicators,
        }, a.id, a.createdAt, a.updatedAt)
      ) || []
    }, model.id, model.createdAt, model.updatedAt);
  }

  async clear(): Promise<void> {
    await StudentAdaptationModel.destroy({ where: {}, truncate: true, cascade: true });
    await LessonPlanModel.destroy({ where: {}, truncate: true, cascade: true });
  }

  async count(): Promise<number> {
    return await LessonPlanModel.count();
  }
}
