import { Neurodivergency } from '../entities/neurodivergency.entity';

export abstract class INeurodivergenciesRepository {
  abstract create(neurodivergency: Neurodivergency): Promise<void>;
  abstract findById(id: string): Promise<Neurodivergency | null>;
  abstract findByIds(ids: string[]): Promise<Neurodivergency[]>;
  abstract findAll(): Promise<Neurodivergency[]>;
}
