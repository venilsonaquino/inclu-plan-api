import { CreateLearningProfileUseCase } from './create-learning-profile.use-case';
import { ILearningProfilesRepository } from '@/modules/learning-profiles/domain/repositories/learning-profiles.repository';
import { CreateLearningProfileOutput } from './create-learning-profile.output';

describe('CreateLearningProfileUseCase', () => {
  let useCase: CreateLearningProfileUseCase;
  let repository: jest.Mocked<ILearningProfilesRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    };
    useCase = new CreateLearningProfileUseCase(repository);
  });

  it('should successfully create a new learning profile', async () => {
    const input = {
      name: 'TEA',
      description: 'Transtorno do Espectro Autista',
    };

    repository.create.mockResolvedValue(undefined);

    const result = await useCase.execute(input);

    expect(result.isSuccess).toBe(true);
    const output = result.getValue();
    expect(output).toBeDefined();
    expect(output.id).toBeDefined();
    expect(output.name).toBe(input.name);
    expect(output.description).toBe(input.description);
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it('should fail when repository throws an error', async () => {
    const input = {
      name: 'TEA',
      description: 'Transtorno do Espectro Autista',
    };

    repository.create.mockRejectedValue(new Error('DB Error'));

    const result = await useCase.execute(input);

    expect(result.isFailure).toBe(true);
    expect(result.errorValue()).toBe('An unexpected error occurred while creating the learning profile.');
  });
});

describe('CreateLearningProfileOutput', () => {
  it('should be defined', () => {
    expect(new CreateLearningProfileOutput()).toBeDefined();
  });
});
