import { CreateTeacherUseCase } from './create-teacher.use-case';
import { InMemoryTeachersRepository } from '@/modules/teachers/infra/persistence/in-memory/in-memory-teachers.repository';
import { CreateTeacherInput } from './create-teacher.input';
import { CreateTeacherOutput } from './create-teacher.output';
import { CryptoUtil } from '@/shared/utils/crypto.util';

describe('CreateTeacherUseCase', () => {
  let useCase: CreateTeacherUseCase;
  let repository: InMemoryTeachersRepository;

  beforeEach(() => {
    repository = new InMemoryTeachersRepository();
    useCase = new CreateTeacherUseCase(repository);
  });

  it('should successfully create a new teacher', async () => {
    const input: CreateTeacherInput = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'strongpassword123',
    };

    const result = await useCase.execute(input);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toHaveProperty('id');
    expect(result.getValue().name).toBe(input.name);
    expect(result.getValue().email).toBe(input.email);

    // Verify it was saved in repo
    const savedTeacher = await repository.findByEmail(input.email);
    expect(savedTeacher).toBeDefined();
    expect(savedTeacher?.name).toBe(input.name);

    // Check if password was hashed
    expect(savedTeacher?.passwordHash).not.toBe(input.password);
    expect(savedTeacher?.passwordHash).toContain(':'); // checking our salt:key format

    // Verify hash actually matches using util
    const isMatch = await CryptoUtil.compare(
      input.password,
      savedTeacher!.passwordHash,
    );
    expect(isMatch).toBe(true);
  });

  it('should fail if email is already in use', async () => {
    const input: CreateTeacherInput = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'strongpassword123',
    };

    // First creation
    await useCase.execute(input);

    // Second creation attempt with same email
    const duplicateInput: CreateTeacherInput = {
      name: 'Jane Doe',
      email: 'john@example.com', // same email
      password: 'anotherpassword456',
    };

    const result = await useCase.execute(duplicateInput);

    expect(result.isFailure).toBe(true);
    expect(result.errorValue()).toBe('Email already in use.');
  });

  it('should fail when repository throws an error', async () => {
    const input: CreateTeacherInput = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'strongpassword123',
    };
    jest.spyOn(repository, 'create').mockRejectedValueOnce(new Error('DB Error'));

    const result = await useCase.execute(input);

    expect(result.isFailure).toBe(true);
    expect(result.errorValue()).toBe(
      'An unexpected error occurred while creating the teacher.',
    );
  });

  it('should cover the fallback branch for non-Error thrown objects', async () => {
    const input: CreateTeacherInput = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'strongpassword123',
    };
    jest.spyOn(repository, 'create').mockRejectedValueOnce('String Error');

    const result = await useCase.execute(input);
    expect(result.isFailure).toBe(true);
  });
});

describe('CreateTeacherOutput', () => {
  it('should be defined', () => {
    expect(new CreateTeacherOutput()).toBeDefined();
  });
});
