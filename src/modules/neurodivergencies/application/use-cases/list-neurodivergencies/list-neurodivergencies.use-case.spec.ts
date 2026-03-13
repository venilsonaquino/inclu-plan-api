import { ListNeurodivergenciesUseCase } from './list-neurodivergencies.use-case';
import { Neurodivergency } from '@/modules/neurodivergencies/domain/entities/neurodivergency.entity';

describe('ListNeurodivergenciesUseCase', () => {
  let useCase: ListNeurodivergenciesUseCase;
  let repository: any;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
    };
    useCase = new ListNeurodivergenciesUseCase(repository);
  });

  it('should return a list of neurodivergencies', async () => {
    const neurodivergencies = [
      new Neurodivergency({
        name: 'TDAH',
        description: 'Description 1',
        icon: 'bolt',
        createdAt: new Date('2023-01-01'),
      }),
      new Neurodivergency({
        name: 'TEA',
        description: 'Description 2',
        icon: 'extension',
        createdAt: new Date('2023-01-02'),
      }),
    ];

    repository.findAll.mockResolvedValue(neurodivergencies);

    const result = await useCase.execute();

    expect(result.isSuccess).toBe(true);
    const value = result.getValue();
    expect(value).toHaveLength(2);
    expect(value[0].name).toBe('TDAH');
    expect(value[0].icon).toBe('bolt');
    expect(value[1].name).toBe('TEA');
    expect(value[1].icon).toBe('extension');
  });

  it('should return an empty list if no neurodivergencies found', async () => {
    repository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toHaveLength(0);
  });

  it('should return failure if repository throws', async () => {
    repository.findAll.mockRejectedValue(new Error('DB error'));

    const result = await useCase.execute();

    expect(result.isFailure).toBe(true);
    expect(result.errorValue()).toBe('An unexpected error occurred while listing the neurodivergencies.');
  });
});
