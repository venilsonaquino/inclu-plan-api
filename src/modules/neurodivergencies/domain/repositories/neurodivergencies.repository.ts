import { Neurodivergency } from '../entities/neurodivergency.entity';

export abstract class INeurodivergenciesRepository {
  abstract create(neurodivergency: Neurodivergency): Promise<void>;
  abstract findById(id: string): Promise<Neurodivergency | null>;
  abstract findAll(): Promise<Neurodivergency[]>;
}
