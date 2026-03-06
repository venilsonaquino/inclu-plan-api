import 'reflect-metadata';
import { NeurodivergencyModel } from './neurodivergency.model';
import { Neurodivergency } from '@/modules/neurodivergencies/domain/entities/neurodivergency.entity';

describe('NeurodivergencyModel', () => {
  it('should map to domain correctly', () => {
    const model = Object.create(NeurodivergencyModel.prototype);
    Object.assign(model, {
      id: '1',
      name: 'Autismo',
      description: 'TEA',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const domain = model.toDomain();

    expect(domain).toBeInstanceOf(Neurodivergency);
    expect(domain.id).toBe('1');
    expect(domain.name).toBe('Autismo');
    expect(domain.description).toBe('TEA');
  });
});
