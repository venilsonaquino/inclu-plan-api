import { Injectable } from '@nestjs/common';
import { ILessonPlanRepository, LessonPlanRecord } from '@/modules/ai/domain/repositories/lesson-plan.repository.interface';
import { LessonPlanModel } from './models/lesson-plan.model';

@Injectable()
export class SequelizeLessonPlanRepository implements ILessonPlanRepository {
  async save(record: LessonPlanRecord): Promise<void> {
    await LessonPlanModel.create(this.mapToModel(record));
  }

  async saveBatch(records: LessonPlanRecord[]): Promise<void> {
    const data = records.map(record => this.mapToModel(record));
    await LessonPlanModel.bulkCreate(data);
  }

  private mapToModel(record: LessonPlanRecord): any {
    return {
      id: record.id,
      teacherId: record.teacherId,
      studentId: record.studentId,
      discipline: record.discipline,
      theme: record.theme,
      objective: record.lessonResult.objective,
      bnccCode: record.lessonResult.bncc.code,
      bnccDescription: record.lessonResult.bncc.description,
      duration: record.lessonResult.duration,
      activitySteps: record.lessonResult.activity_steps,
      resources: record.lessonResult.resources,
      evaluation: record.lessonResult.evaluation,
      udlRepresentation: record.lessonResult.udl_strategies.representation,
      udlActionExpression: record.lessonResult.udl_strategies.action_and_expression,
      udlEngagement: record.lessonResult.udl_strategies.engagement,
      adaptationStrategy: record.adaptationDetails.strategy,
      behavioralTips: record.adaptationDetails.behavioral_tips,
    };
  }

  async findSimilar(): Promise<any> {
    // Implementação pendente para RAG futuro
    return null;
  }

  clear(): void { }
  count(): number { return 0; }
}
