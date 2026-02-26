import { Injectable } from '@nestjs/common';
import { ILearningProfilesRepository } from '@/modules/learning-profiles/domain/repositories/learning-profiles.repository';
import { CreateLearningProfileInput } from './create-learning-profile.input';
import { CreateLearningProfileOutput } from './create-learning-profile.output';
import { Result } from '@/shared/domain/utils/result';
import { LearningProfile } from '@/modules/learning-profiles/domain/entities/learning-profile.entity';

@Injectable()
export class CreateLearningProfileUseCase {
  constructor(private readonly learningProfilesRepository: ILearningProfilesRepository) { }

  async execute(input: CreateLearningProfileInput): Promise<Result<CreateLearningProfileOutput>> {
    try {
      const newProfile = new LearningProfile({
        id: crypto.randomUUID(),
        name: input.name,
        description: input.description,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await this.learningProfilesRepository.create(newProfile);

      return Result.ok({
        id: newProfile.id,
        name: newProfile.name,
        description: newProfile.description,
        createdAt: newProfile.createdAt
      });

    } catch (error) {
      return Result.fail('An unexpected error occurred while creating the learning profile.');
    }
  }
}
