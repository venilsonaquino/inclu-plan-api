import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ILearningProfilesRepository } from '@/modules/learning-profiles/domain/repositories/learning-profiles.repository';
import { LearningProfile } from '@/modules/learning-profiles/domain/entities/learning-profile.entity';
import { LearningProfileModel } from '@/modules/learning-profiles/infra/persistence/sequelize/models/learning-profile.model';

@Injectable()
export class SequelizeLearningProfilesRepository implements ILearningProfilesRepository {
  constructor(
    @InjectModel(LearningProfileModel)
    private readonly learningProfileModel: typeof LearningProfileModel,
  ) {}

  async create(learningProfile: LearningProfile): Promise<void> {
    await this.learningProfileModel.create({
      id: learningProfile.id,
      name: learningProfile.name,
      description: learningProfile.description,
      createdAt: learningProfile.createdAt,
      updatedAt: learningProfile.updatedAt,
    });
  }

  async findById(id: string): Promise<LearningProfile | null> {
    const model = await this.learningProfileModel.findByPk(id);
    if (!model) return null;
    return model.toDomain();
  }

  async findAll(): Promise<LearningProfile[]> {
    const models = await this.learningProfileModel.findAll();
    return models.map(model => model.toDomain());
  }
}
