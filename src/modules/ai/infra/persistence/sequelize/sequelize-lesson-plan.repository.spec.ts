import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeLessonPlanRepository } from './sequelize-lesson-plan.repository';
import { LessonPlanModel } from './models/lesson-plan.model';

jest.mock('./models/lesson-plan.model');

describe('SequelizeLessonPlanRepository', () => {
  let repository: SequelizeLessonPlanRepository;

  const mockRecord = {
    id: 'id-1',
    teacherId: 'teacher-1',
    studentId: 'student-1',
    discipline: 'Math',
    theme: 'Fractions',
    lessonResult: {
      objective: 'Obj',
      bncc: { code: 'BNCC', description: 'Desc' },
      duration: '45min',
      activity_steps: 'Steps',
      resources: 'Res',
      evaluation: 'Eval',
      udl_strategies: {
        representation: 'R',
        action_and_expression: 'AE',
        engagement: 'E'
      }
    },
    adaptationDetails: {
      strategy: 'Strat',
      behavioral_tips: 'Tips'
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SequelizeLessonPlanRepository],
    }).compile();

    repository = module.get<SequelizeLessonPlanRepository>(SequelizeLessonPlanRepository);
    jest.clearAllMocks();
  });

  it('should save a single record', async () => {
    (LessonPlanModel.create as jest.Mock).mockResolvedValue({});

    await repository.save(mockRecord as any);

    expect(LessonPlanModel.create).toHaveBeenCalledTimes(1);
    const callArgs = (LessonPlanModel.create as jest.Mock).mock.calls[0][0];
    expect(callArgs.id).toBe(mockRecord.id);
    expect(callArgs.adaptationStrategy).toBe(mockRecord.adaptationDetails.strategy);
  });

  it('should save a batch of records', async () => {
    (LessonPlanModel.bulkCreate as jest.Mock).mockResolvedValue([]);

    await repository.saveBatch([mockRecord as any, mockRecord as any]);

    expect(LessonPlanModel.bulkCreate).toHaveBeenCalledTimes(1);
    const callArgsArray = (LessonPlanModel.bulkCreate as jest.Mock).mock.calls[0][0];
    expect(callArgsArray).toHaveLength(2);
    expect(callArgsArray[0].id).toBe(mockRecord.id);
  });

  it('should return null on findSimilar (stub)', async () => {
    const result = await repository.findSimilar();
    expect(result).toBeNull();
  });
});
