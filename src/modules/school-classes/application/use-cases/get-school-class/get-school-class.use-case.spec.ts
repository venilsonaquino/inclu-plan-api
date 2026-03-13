import { GetSchoolClassUseCase } from './get-school-class.use-case';
import { SchoolClass } from '@/modules/school-classes/domain/entities/school-class.entity';

describe('GetSchoolClassUseCase', () => {
  let useCase: GetSchoolClassUseCase;
  let mockSchoolClassesRepository: any;
  let mockTeachersRepository: any;

  beforeEach(() => {
    mockSchoolClassesRepository = {
      findById: jest.fn(),
    };

    mockTeachersRepository = {
      findByUserId: jest.fn(),
    };

    useCase = new GetSchoolClassUseCase(
      mockSchoolClassesRepository,
      mockTeachersRepository,
    );
  });

  it('should return an error if id is missing', async () => {
    const result = await useCase.execute({ id: '', userId: 'user-1' });
    expect(result.isFailure).toBe(true);
    expect(result.errorValue()).toBe('School class ID is required.');
  });

  it('should return an error if userId is missing', async () => {
    const result = await useCase.execute({ id: 'class-1', userId: '' });
    expect(result.isFailure).toBe(true);
    expect(result.errorValue()).toBe('User ID is required.');
  });

  it('should return error if teacher record is not found', async () => {
    mockTeachersRepository.findByUserId.mockResolvedValue(null);
    const result = await useCase.execute({ id: 'class-1', userId: 'user-1' });
    expect(result.isFailure).toBe(true);
    expect(result.errorValue()).toBe('Teacher record not found.');
  });

  it('should return error if school class not found', async () => {
    mockTeachersRepository.findByUserId.mockResolvedValue({ id: 'teacher-1' });
    mockSchoolClassesRepository.findById.mockResolvedValue(null);
    const result = await useCase.execute({ id: 'class-1', userId: 'user-1' });
    expect(result.isFailure).toBe(true);
    expect(result.errorValue()).toBe('School class not found.');
  });

  it('should return error if classroom doesn\'t belong to teacher', async () => {
    mockTeachersRepository.findByUserId.mockResolvedValue({ id: 'teacher-1' });
    mockSchoolClassesRepository.findById.mockResolvedValue(new SchoolClass({ teacherId: 'teacher-2' }, 'class-1'));
    
    const result = await useCase.execute({ id: 'class-1', userId: 'user-1' });
    expect(result.isFailure).toBe(true);
    expect(result.errorValue()).toBe('You do not have permission to access this school class.');
  });

  it('should return the school class with students mapped', async () => {
    mockTeachersRepository.findByUserId.mockResolvedValue({ id: 'teacher-1' });
    
    const classEntity = new SchoolClass(
      {
        name: 'Science 101',
        teacherId: 'teacher-1',
        isActive: true,
        students: [
          { id: 's1', name: 'Alice', gradeId: 'g1', isActive: true }
        ] as any,
        createdAt: new Date('2023-01-01T10:00:00Z'),
      },
      'class-1'
    );
    mockSchoolClassesRepository.findById.mockResolvedValue(classEntity);

    const result = await useCase.execute({ id: 'class-1', userId: 'user-1' });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toEqual({
      id: 'class-1',
      name: 'Science 101',
      isActive: true,
      students: [
        { id: 's1', name: 'Alice', gradeId: 'g1', isActive: true }
      ],
      createdAt: '2023-01-01T10:00:00.000Z',
    });
  });
});
