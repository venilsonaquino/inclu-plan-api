import { LearningProfile } from '../entities/learning-profile.entity';

export abstract class ILearningProfilesRepository {
  abstract create(learningProfile: LearningProfile): Promise<void>;
  abstract findById(id: string): Promise<LearningProfile | null>;
  abstract findAll(): Promise<LearningProfile[]>;
}
