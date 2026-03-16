import { ListLessonPlansUseCase } from './list-lesson-plans.use-case';
import { ILessonPlanRepository } from '@/modules/lessons/domain/repositories/lesson-plan.repository.interface';
import { ITeachersRepository } from '@/modules/teachers/domain/repositories/teachers.repository';
import { LessonPlan } from '@/modules/lessons/domain/entities/lesson-plan.entity';

describe('ListLessonPlansUseCase', () => {
  let useCase: ListLessonPlansUseCase;
  let lessonPlanRepository: jest.Mocked<ILessonPlanRepository>;
  let teachersRepository: jest.Mocked<ITeachersRepository>;

  beforeEach(() => {
    lessonPlanRepository = {
      findAll: jest.fn(),
      save: jest.fn(),
      saveBatch: jest.fn(),
      findById: jest.fn(),
      clear: jest.fn(),
      count: jest.fn(),
    } as any;
    
    teachersRepository = {
      findByUserId: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    } as any;

    useCase = new ListLessonPlansUseCase(lessonPlanRepository, teachersRepository);
  });

  it('should successfully list lesson plans', async () => {
    const input = { userId: 'user-123', limit: 3 };
    const mockTeacher = { id: 'teacher-123', userId: 'user-123' };
    const mockPlans = [
      LessonPlan.create({ teacherId: 'teacher-123', discipline: 'Math', theme: 'Algebra', lessonTitle: 'Lesson 1' }),
    ];

    teachersRepository.findByUserId.mockResolvedValue(mockTeacher as any);
    lessonPlanRepository.findAll.mockResolvedValue(mockPlans);

    const result = await useCase.execute(input);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toHaveLength(1);
    expect(teachersRepository.findByUserId).toHaveBeenCalledWith('user-123');
    expect(lessonPlanRepository.findAll).toHaveBeenCalledWith({ teacherId: 'teacher-123', limit: 3 });
  });

  it('should fail if teacher is not found', async () => {
    const input = { userId: 'user-123' };
    teachersRepository.findByUserId.mockResolvedValue(null);

    const result = await useCase.execute(input);

    expect(result.isFailure).toBe(true);
    expect(result.errorValue()).toBe('Teacher record not found.');
  });
});

