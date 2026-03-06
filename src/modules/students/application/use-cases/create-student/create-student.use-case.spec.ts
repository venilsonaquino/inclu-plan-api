import { CreateStudentUseCase } from './create-student.use-case';
import { IStudentsRepository } from '@/modules/students/domain/repositories/students.repository';
import { CreateStudentOutput } from './create-student.output';

describe('CreateStudentUseCase', () => {
  let useCase: CreateStudentUseCase;
  let studentsRepository: jest.Mocked<IStudentsRepository>;

  beforeEach(() => {
    studentsRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByClassId: jest.fn(),
    };
    useCase = new CreateStudentUseCase(studentsRepository);
  });

  it('should successfully create a new student', async () => {
    const input = {
      name: 'John Doe',
      gradeId: 'grade-123',
      neurodivergencies: ['profile-1', 'profile-2'],
      schoolClassId: 'class-abc',
    };

    studentsRepository.create.mockResolvedValue(undefined);

    const result = await useCase.execute(input);

    expect(result.isSuccess).toBe(true);
    const output = result.getValue();
    expect(output).toBeDefined();
    expect(output.id).toBeDefined();
    expect(output.name).toBe(input.name);
    expect(output.gradeId).toBe(input.gradeId);
    expect(output.neurodivergencies).toEqual(input.neurodivergencies);
    expect(output.schoolClassId).toBe(input.schoolClassId);
    expect(studentsRepository.create).toHaveBeenCalledTimes(1);
    expect(studentsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: input.name,
        gradeId: input.gradeId,
        neurodivergencies: input.neurodivergencies,
      }),
    );
  });

  it('should fail when repository throws an error', async () => {
    const input = {
      name: 'John Doe',
      gradeId: 'grade-123',
      neurodivergencies: [],
    };

    studentsRepository.create.mockRejectedValue(new Error('DB Error'));

    const result = await useCase.execute(input);

    expect(result.isFailure).toBe(true);
    expect(result.errorValue()).toBe('An unexpected error occurred while creating the student.');
  });

  it('should cover the fallback branch for non-Error thrown objects', async () => {
    const input = {
      name: 'John Doe',
      gradeId: 'grade-123',
      neurodivergencies: [],
    };
    studentsRepository.create.mockRejectedValue('String Error');
    const result = await useCase.execute(input);
    expect(result.isFailure).toBe(true);
  });
});

describe('CreateStudentOutput', () => {
  it('should be defined', () => {
    expect(new CreateStudentOutput()).toBeDefined();
  });
});
