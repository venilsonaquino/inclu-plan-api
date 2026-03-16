import { Injectable } from '@nestjs/common';
import { UseCase } from '@/shared/domain/interfaces/use-case';
import { Result } from '@/shared/domain/utils/result';
import { ILessonPlanRepository } from '@/modules/lessons/domain/repositories/lesson-plan.repository.interface';
import { ITeachersRepository } from '@/modules/teachers/domain/repositories/teachers.repository';
import { GetLessonPlanInput } from './get-lesson-plan.input';
import { GetLessonPlanOutput } from './get-lesson-plan.output';

@Injectable()
export class GetLessonPlanUseCase implements UseCase<GetLessonPlanInput, GetLessonPlanOutput> {
  constructor(
    private readonly repository: ILessonPlanRepository,
    private readonly teachersRepository: ITeachersRepository,
  ) {}

  async execute(request: GetLessonPlanInput): Promise<Result<GetLessonPlanOutput>> {
    try {
      if (!request.userId) {
        return Result.fail('User ID is required.');
      }

      const teacher = await this.teachersRepository.findByUserId(request.userId);
      if (!teacher) {
        return Result.fail('Teacher record not found.');
      }

      const plan = await this.repository.findById(request.id);
      if (!plan) {
        return Result.fail('Lesson Plan not found.');
      }

      // Verify ownership
      if (plan.teacherId !== teacher.id) {
        return Result.fail('You do not have permission to view this lesson plan.');
      }

      const output: GetLessonPlanOutput = {
        id: plan.id,
        teacherId: plan.teacherId,
        discipline: plan.discipline,
        theme: plan.theme,
        lessonTitle: plan.lessonTitle,
        estimatedPrepTime: plan.estimatedPrepTime,
        lessonNumber: plan.lessonNumber,
        objective: plan.objective,
        learningObjects: plan.learningObjects,
        bnccCode: plan.bnccCode,
        bnccDescription: plan.bnccDescription,
        duration: plan.duration,
        activitySteps: plan.activitySteps,
        udlRepresentation: plan.udlRepresentation,
        udlActionExpression: plan.udlActionExpression,
        udlEngagement: plan.udlEngagement,
        resources: plan.resources,
        evaluation: plan.evaluation,
        adaptations: plan.adaptations.map(a => ({
          id: a.id,
          studentId: a.studentId,
          studentName: a.studentName,
          studentGrade: a.studentGrade,
          studentNeurodivergencies: a.studentNeurodivergencies,
          strategy: a.strategy,
          behavioralTips: a.behavioralTips,
          supportLevel: a.supportLevel,
          successIndicators: a.successIndicators,
        })),
        createdAt: plan.created_at,
        updatedAt: plan.updated_at,
      };

      return Result.ok(output);
    } catch (error) {
      return Result.fail(error instanceof Error ? error.message : 'Unknown error fetching lesson plan');
    }
  }
}
