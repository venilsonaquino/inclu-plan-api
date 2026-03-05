import { Injectable } from '@nestjs/common';
import { IStudentLearningProfilesRepository } from '@/modules/student-learning-profiles/domain/repositories/student-learning-profiles.repository';
import { AssignProfileInput } from './assign-profile.input';
import { AssignProfileOutput } from './assign-profile.output';
import { Result } from '@/shared/domain/utils/result';
import { StudentLearningProfile } from '@/modules/student-learning-profiles/domain/entities/student-learning-profile.entity';

@Injectable()
export class AssignProfileToStudentUseCase {
  constructor(
    private readonly repository: IStudentLearningProfilesRepository,
  ) {}

  async execute(
    input: AssignProfileInput,
  ): Promise<Result<AssignProfileOutput>> {
    try {
      const association = new StudentLearningProfile({
        id: crypto.randomUUID(),
        studentId: input.studentId,
        learningProfileId: input.learningProfileId,
        notes: input.notes,
        createdAt: new Date(),
      });

      await this.repository.assign(association);

      return Result.ok({
        id: association.id,
        studentId: association.studentId,
        learningProfileId: association.learningProfileId,
        notes: association.notes,
        createdAt: association.createdAt,
      });
    } catch (error) {
      return Result.fail(
        'An unexpected error occurred while assigning the profile to the student.',
      );
    }
  }
}
