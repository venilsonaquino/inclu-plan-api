import { Injectable } from '@nestjs/common';
import { UseCase } from '@/shared/domain/interfaces/use-case';
import { Result } from '@/shared/domain/utils/result';
import { ILessonPlanRepository } from '@/modules/lessons/domain/repositories/lesson-plan.repository.interface';
import { ListLessonPlansInput } from './list-lesson-plans.input';
import { ListLessonPlansOutput } from './list-lesson-plans.output';
import { ITeachersRepository } from '@/modules/teachers/domain/repositories/teachers.repository';

@Injectable()
export class ListLessonPlansUseCase implements UseCase<ListLessonPlansInput, ListLessonPlansOutput[]> {
  constructor(
    private readonly repository: ILessonPlanRepository,
    private readonly teachersRepository: ITeachersRepository,
  ) {}

  async execute(request: ListLessonPlansInput): Promise<Result<ListLessonPlansOutput[]>> {
    try {
      if (!request.userId) {
        return Result.fail('User ID is required to list lesson plans.');
      }

      const teacher = await this.teachersRepository.findByUserId(request.userId);
      if (!teacher) {
        return Result.fail('Teacher record not found.');
      }

      const plans = await this.repository.findAll({
        teacherId: teacher.id,
        limit: request.limit
      });

      const output: ListLessonPlansOutput[] = plans.map(plan => ({
        id: plan.id,
        title: plan.lessonTitle,
        description: plan.objective || plan.theme || '',
        targetAudience: plan.adaptations?.[0]?.studentGrade || 'Geral',
        createdAt: plan.created_at,
      }));

      return Result.ok(output);
    } catch (error) {
      return Result.fail(error instanceof Error ? error.message : 'Unknown error listing lesson plans');
    }
  }
}


