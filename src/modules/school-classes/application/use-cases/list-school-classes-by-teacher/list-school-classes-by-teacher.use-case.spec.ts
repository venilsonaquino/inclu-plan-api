import { ListSchoolClassesByTeacherUseCase } from './list-school-classes-by-teacher.use-case';
import { Result } from '@/shared/domain/utils/result';
import { SchoolClass } from '@/modules/school-classes/domain/entities/school-class.entity';

describe('ListSchoolClassesByTeacherUseCase', () => {
  let useCase: ListSchoolClassesByTeacherUseCase;
  let mockSchoolClassesRepository: any;
  let mockTeachersRepository: any;

  beforeEach(() => {
    mockSchoolClassesRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByTeacherId: jest.fn(),
    };

    mockTeachersRepository = {
      findByUserId: jest.fn(),
    };

    useCase = new ListSchoolClassesByTeacherUseCase(
      mockSchoolClassesRepository,
      mockTeachersRepository,
    );
  });

  it('should return an error if userId is missing', async () => {
    const input: any = { userId: '' };
    const result = await useCase.execute(input);

    expect(result.isFailure).toBe(true);
    expect(result.errorValue()).toBe('User ID is required to list school classes.');
  });

  it('should return empty array if teacher record is not found', async () => {
    mockTeachersRepository.findByUserId.mockResolvedValue(null);

    const result = await useCase.execute({ userId: 'user-123' });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toEqual([]);
  });

  it('should return a list of school classes with students mapped', async () => {
    mockTeachersRepository.findByUserId.mockResolvedValue({ id: 'teacher-456' });

    const classEntity = new SchoolClass(
      {
        name: 'Math 101',
        teacherId: 'teacher-456',
        isActive: true,
        students: [
          {
            id: 'stu-1',
            name: 'John Doe',
            gradeId: 'grade-1',
            isActive: true,
          },
        ] as any,
        createdAt: new Date('2023-01-01T10:00:00.000Z'),
        updatedAt: new Date('2023-01-01T10:00:00.000Z'),
      },
      'class-789',
    );

    mockSchoolClassesRepository.findByTeacherId.mockResolvedValue([classEntity]);

    const result = await useCase.execute({ userId: 'user-123' });

    expect(result.isSuccess).toBe(true);
    const value = result.getValue();
    expect(value).toHaveLength(1);
    expect(value[0]).toEqual({
      id: 'class-789',
      name: 'Math 101',
      isActive: true,
      students: [
        {
          id: 'stu-1',
          name: 'John Doe',
          gradeId: 'grade-1',
          isActive: true,
        },
      ],
      createdAt: '2023-01-01T10:00:00.000Z',
    });
  });

  it('should fail if an unexpected error occurs', async () => {
    mockTeachersRepository.findByUserId.mockRejectedValue(new Error('Internal DB error'));

    const result = await useCase.execute({ userId: 'user-123' });

    expect(result.isFailure).toBe(true);
    expect(result.errorValue()).toBe('An unexpected error occurred while listing the school classes.');
  });
});
