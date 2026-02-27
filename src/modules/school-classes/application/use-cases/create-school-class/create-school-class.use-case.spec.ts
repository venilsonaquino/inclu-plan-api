import { CreateSchoolClassUseCase } from './create-school-class.use-case';
import { ISchoolClassesRepository } from '@/modules/school-classes/domain/repositories/school-classes.repository';
import { CreateSchoolClassOutput } from './create-school-class.output';

describe('CreateSchoolClassUseCase', () => {
  let useCase: CreateSchoolClassUseCase;
  let repository: jest.Mocked<ISchoolClassesRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByTeacherId: jest.fn(),
    };
    useCase = new CreateSchoolClassUseCase(repository);
  });

  it('should successfully create a new school class', async () => {
    const input = {
      name: '3º Ano B',
      teacherId: 'teacher-123',
    };

    repository.create.mockResolvedValue(undefined);

    const result = await useCase.execute(input);

    expect(result.isSuccess).toBe(true);
    const output = result.getValue();
    expect(output).toBeDefined();
    expect(output.id).toBeDefined();
    expect(output.name).toBe(input.name);
    expect(output.teacherId).toBe(input.teacherId);
    expect(output.isActive).toBe(true);
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it('should fail when repository throws an error', async () => {
    const input = {
      name: '3º Ano B',
      teacherId: 'teacher-123',
    };

    repository.create.mockRejectedValue(new Error('DB Error'));

    const result = await useCase.execute(input);

    expect(result.isFailure).toBe(true);
    expect(result.errorValue()).toBe('An unexpected error occurred while creating the school class.');
  });
});

describe('CreateSchoolClassOutput', () => {
  it('should be defined', () => {
    expect(new CreateSchoolClassOutput()).toBeDefined();
  });
});
