import { CreateSchoolClassUseCase } from './create-school-class.use-case';
import { ISchoolClassesRepository } from '@/modules/school-classes/domain/repositories/school-classes.repository';
import { ITeachersRepository } from '@/modules/teachers/domain/repositories/teachers.repository';
import { CreateSchoolClassOutput } from './create-school-class.output';

describe('CreateSchoolClassUseCase', () => {
  let useCase: CreateSchoolClassUseCase;
  let repository: jest.Mocked<ISchoolClassesRepository>;
  let teachersRepo: jest.Mocked<ITeachersRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByTeacherId: jest.fn(),
    };
    teachersRepo = {
      findByUserId: jest.fn().mockResolvedValue({ id: 'teacher-123' })
    } as any;
    useCase = new CreateSchoolClassUseCase(repository, teachersRepo);
  });

  it('should successfully create a new school class', async () => {
    const input = {
      name: '3º Ano B',
      userId: 'user-1',
    };

    repository.create.mockResolvedValue(undefined);

    const result = await useCase.execute(input);

    expect(result.isSuccess).toBe(true);
    const output = result.getValue();
    expect(output).toBeDefined();
    expect(output.id).toBeDefined();
    expect(output.name).toBe(input.name);
    expect(output.teacherId).toBe('teacher-123');
    expect(output.isActive).toBe(true);
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it('should fail when repository throws an error', async () => {
    const input = {
      name: '3º Ano B',
      userId: 'user-1',
    };

    repository.create.mockRejectedValue(new Error('DB Error'));

    const result = await useCase.execute(input);

    expect(result.isFailure).toBe(true);
    expect(result.errorValue()).toBe('An unexpected error occurred while creating the school class.');
  });

  it('should cover the fallback branch for non-Error thrown objects', async () => {
    const input = {
      name: '3º Ano B',
      userId: 'user-1',
    };
    repository.create.mockRejectedValue('String Error');
    const result = await useCase.execute(input);
    expect(result.isFailure).toBe(true);
  });
});

describe('CreateSchoolClassOutput', () => {
  it('should be defined', () => {
    expect(new CreateSchoolClassOutput()).toBeDefined();
  });
});
