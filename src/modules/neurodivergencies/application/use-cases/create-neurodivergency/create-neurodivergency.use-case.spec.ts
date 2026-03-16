import { CreateNeurodivergencyUseCase } from './create-neurodivergency.use-case';
import { INeurodivergenciesRepository } from '@/modules/neurodivergencies/domain/repositories/neurodivergencies.repository';

describe('CreateNeurodivergencyUseCase', () => {
  let useCase: CreateNeurodivergencyUseCase;
  let repository: INeurodivergenciesRepository;

  beforeEach(() => {
    repository = {
      create: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn(),
      findByIds: jest.fn(),
      findAll: jest.fn(),
    } as any;
    useCase = new CreateNeurodivergencyUseCase(repository);
  });

  it('should create a neurodivergency successfully', async () => {
    const input = {
      name: 'Autismo',
      position: 1,
      description: 'Transtorno do Espectro Autista',
      icon: 'extension',
    };

    const result = await useCase.execute(input);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().name).toBe(input.name);
    expect(result.getValue().icon).toBe(input.icon);
    expect(repository.create).toHaveBeenCalled();
  });

  it('should return failure if repository throws', async () => {
    jest.spyOn(repository, 'create').mockRejectedValueOnce(new Error('DB Error'));

    const input = {
      name: 'Autismo',
      position: 1,
      description: 'Transtorno do Espectro Autista',
      icon: 'extension',
    };

    const result = await useCase.execute(input);

    expect(result.isFailure).toBe(true);
    expect(result.errorValue()).toBe('An unexpected error occurred while creating the neurodivergency.');
  });
});
