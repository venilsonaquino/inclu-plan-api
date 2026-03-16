import { GetLessonPlanUseCase } from './get-lesson-plan.use-case';
import { ILessonPlanRepository } from '@/modules/lessons/domain/repositories/lesson-plan.repository.interface';
import { ITeachersRepository } from '@/modules/teachers/domain/repositories/teachers.repository';
import { LessonPlan } from '@/modules/lessons/domain/entities/lesson-plan.entity';

describe('GetLessonPlanUseCase', () => {
  let useCase: GetLessonPlanUseCase;
  let lessonPlanRepository: jest.Mocked<ILessonPlanRepository>;
  let teachersRepository: jest.Mocked<ITeachersRepository>;

  beforeEach(() => {
    lessonPlanRepository = {
      findById: jest.fn(),
    } as any;
    
    teachersRepository = {
      findByUserId: jest.fn(),
    } as any;

    useCase = new GetLessonPlanUseCase(lessonPlanRepository, teachersRepository);
  });

  it('should successfully get a lesson plan', async () => {
    const input = { id: 'plan-123', userId: 'user-123' };
    const mockTeacher = { id: 'teacher-123', userId: 'user-123' };
    const mockPlan = LessonPlan.create({ teacherId: 'teacher-123', discipline: 'Math', theme: 'Alg', lessonTitle: 'Title 1' });

    teachersRepository.findByUserId.mockResolvedValue(mockTeacher as any);
    lessonPlanRepository.findById.mockResolvedValue(mockPlan);

    const result = await useCase.execute(input);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().id).toBe(mockPlan.id);
    expect(teachersRepository.findByUserId).toHaveBeenCalledWith('user-123');
    expect(lessonPlanRepository.findById).toHaveBeenCalledWith('plan-123');
  });

  it('should fail if teacher is not found', async () => {
    const input = { id: 'plan-123', userId: 'user-123' };
    teachersRepository.findByUserId.mockResolvedValue(null);

    const result = await useCase.execute(input);

    expect(result.isFailure).toBe(true);
    expect(result.errorValue()).toBe('Teacher record not found.');
  });

  it('should fail if lesson plan is not found', async () => {
    const input = { id: 'plan-123', userId: 'user-123' };
    const mockTeacher = { id: 'teacher-123', userId: 'user-123' };

    teachersRepository.findByUserId.mockResolvedValue(mockTeacher as any);
    lessonPlanRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(input);

    expect(result.isFailure).toBe(true);
    expect(result.errorValue()).toBe('Lesson Plan not found.');
  });

  it('should fail if teacher is not owner', async () => {
    const input = { id: 'plan-123', userId: 'user-123' };
    const mockTeacher = { id: 'teacher-123', userId: 'user-123' };
    const mockPlan = LessonPlan.create({ teacherId: 'teacher-456', discipline: 'Math', theme: 'Alg', lessonTitle: 'Title 1' });

    teachersRepository.findByUserId.mockResolvedValue(mockTeacher as any);
    lessonPlanRepository.findById.mockResolvedValue(mockPlan);

    const result = await useCase.execute(input);

    expect(result.isFailure).toBe(true);
    expect(result.errorValue()).toBe('You do not have permission to view this lesson plan.');
  });
});
