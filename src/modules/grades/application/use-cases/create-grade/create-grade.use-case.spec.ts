import { CreateGradeUseCase } from './create-grade.use-case';
import { IGradesRepository } from '@/modules/grades/domain/repositories/grades.repository';
import { CreateGradeOutput } from './create-grade.output';

describe('CreateGradeUseCase', () => {
  let useCase: CreateGradeUseCase;
  let repository: jest.Mocked<IGradesRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    };
    useCase = new CreateGradeUseCase(repository);
  });

  it('should successfully create a new grade', async () => {
    const input = {
      name: 'Ensino Fundamental I',
      description: 'Anos iniciais',
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
      name: 'Ensino Fundamental I',
    };

    repository.create.mockRejectedValue(new Error('DB Error'));

    const result = await useCase.execute(input);

    expect(result.isFailure).toBe(true);
    expect(result.errorValue()).toBe('An unexpected error occurred while creating the grade level.');
  });

  it('should cover the fallback branch for non-Error thrown objects', async () => {
    const input = {
      name: 'Ensino Fundamental I',
    };
    repository.create.mockRejectedValue('String Error');
    const result = await useCase.execute(input);
    expect(result.isFailure).toBe(true);
  });
});

describe('CreateGradeOutput', () => {
  it('should be defined', () => {
    expect(new CreateGradeOutput()).toBeDefined();
  });
});
