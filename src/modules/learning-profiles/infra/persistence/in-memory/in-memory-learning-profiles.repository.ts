import { Injectable } from '@nestjs/common';
import { ILearningProfilesRepository } from '@/modules/learning-profiles/domain/repositories/learning-profiles.repository';
import { LearningProfile } from '@/modules/learning-profiles/domain/entities/learning-profile.entity';

@Injectable()
export class InMemoryLearningProfilesRepository implements ILearningProfilesRepository {
  private profiles: LearningProfile[] = [];

  async create(learningProfile: LearningProfile): Promise<void> {
    this.profiles.push(learningProfile);
  }

  async findById(id: string): Promise<LearningProfile | null> {
    const profile = this.profiles.find((p) => p.id === id);
    return profile ? profile : null;
  }

  async findAll(): Promise<LearningProfile[]> {
    return this.profiles;
  }
}
