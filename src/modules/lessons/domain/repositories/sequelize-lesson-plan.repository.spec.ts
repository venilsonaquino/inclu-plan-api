import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { SequelizeLessonPlanRepository } from '../../infra/persistence/sequelize/sequelize-lesson-plan.repository';
import { LessonPlanModel } from '../../infra/persistence/sequelize/models/lesson-plan.model';
import { StudentAdaptationModel } from '../../infra/persistence/sequelize/models/student-adaptation.model';

jest.mock('../../infra/persistence/sequelize/models/lesson-plan.model');
jest.mock('../../infra/persistence/sequelize/models/student-adaptation.model');

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
    },
    adaptations: []
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SequelizeLessonPlanRepository,
        {
          provide: Sequelize,
          useValue: { transaction: jest.fn(cb => cb({})) },
        },
      ],
    }).compile();

    repository = module.get<SequelizeLessonPlanRepository>(SequelizeLessonPlanRepository);
    jest.clearAllMocks();
  });

  it('should save a batch of records', async () => {
    (LessonPlanModel.upsert as jest.Mock).mockResolvedValue([{}, true]);
    (StudentAdaptationModel.bulkCreate as jest.Mock).mockResolvedValue([]);
    (StudentAdaptationModel.destroy as jest.Mock).mockResolvedValue(1);

    await repository.saveBatch([mockRecord as any]);

    expect(LessonPlanModel.upsert).toHaveBeenCalledTimes(1);
  });
});
