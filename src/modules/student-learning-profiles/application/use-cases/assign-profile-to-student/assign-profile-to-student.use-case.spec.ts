import { AssignProfileToStudentUseCase } from './assign-profile-to-student.use-case';
import { IStudentLearningProfilesRepository } from '@/modules/student-learning-profiles/domain/repositories/student-learning-profiles.repository';
import { AssignProfileOutput } from './assign-profile.output';

describe('AssignProfileToStudentUseCase', () => {
  let useCase: AssignProfileToStudentUseCase;
  let repository: jest.Mocked<IStudentLearningProfilesRepository>;

  beforeEach(() => {
    repository = {
      assign: jest.fn(),
      findByStudentId: jest.fn(),
      findByProfileId: jest.fn(),
      remove: jest.fn(),
    };
    useCase = new AssignProfileToStudentUseCase(repository);
  });

  it('should successfully assign a learning profile to a student', async () => {
    const input = {
      studentId: 'student-123',
      learningProfileId: 'profile-abc',
      notes: 'Needs visual support',
    };

    repository.assign.mockResolvedValue(undefined);

    const result = await useCase.execute(input);

    expect(result.isSuccess).toBe(true);
    const output = result.getValue();
    expect(output).toBeDefined();
    expect(output.id).toBeDefined();
    expect(output.studentId).toBe(input.studentId);
    expect(output.learningProfileId).toBe(input.learningProfileId);
    expect(output.notes).toBe(input.notes);
    expect(repository.assign).toHaveBeenCalledTimes(1);
  });

  it('should fail when repository throws an error', async () => {
    const input = {
      studentId: 'student-123',
      learningProfileId: 'profile-abc',
    };

    repository.assign.mockRejectedValue(new Error('DB Error'));

    const result = await useCase.execute(input);

    expect(result.isFailure).toBe(true);
    expect(result.errorValue()).toBe(
      'An unexpected error occurred while assigning the profile to the student.',
    );
  });
});

describe('AssignProfileOutput', () => {
  it('should be defined', () => {
    expect(new AssignProfileOutput()).toBeDefined();
  });
});
