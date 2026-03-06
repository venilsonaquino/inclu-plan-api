import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { INeurodivergenciesRepository } from '@/modules/neurodivergencies/domain/repositories/neurodivergencies.repository';
import { Neurodivergency } from '@/modules/neurodivergencies/domain/entities/neurodivergency.entity';
import { NeurodivergencyModel } from '@/modules/neurodivergencies/infra/persistence/sequelize/models/neurodivergency.model';

@Injectable()
export class SequelizeNeurodivergenciesRepository implements INeurodivergenciesRepository {
  constructor(
    @InjectModel(NeurodivergencyModel)
    private readonly neurodivergencyModel: typeof NeurodivergencyModel,
  ) { }

  async create(neurodivergency: Neurodivergency): Promise<void> {
    await this.neurodivergencyModel.create({
      id: neurodivergency.id,
      name: neurodivergency.name,
      description: neurodivergency.description,
      createdAt: neurodivergency.createdAt,
      updatedAt: neurodivergency.updatedAt,
    });
  }

  async findById(id: string): Promise<Neurodivergency | null> {
    const model = await this.neurodivergencyModel.findByPk(id);
    if (!model) return null;
    return model.toDomain();
  }

  async findAll(): Promise<Neurodivergency[]> {
    const models = await this.neurodivergencyModel.findAll();
    return models.map(model => model.toDomain());
  }
}
