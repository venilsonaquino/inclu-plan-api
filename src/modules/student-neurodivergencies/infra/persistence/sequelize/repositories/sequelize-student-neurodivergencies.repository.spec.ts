import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { SequelizeStudentNeurodivergenciesRepository } from './sequelize-student-neurodivergencies.repository';
import { StudentNeurodivergencyModel } from '../models/student-neurodivergency.model';
import { StudentNeurodivergency } from '@/modules/student-neurodivergencies/domain/entities/student-neurodivergency.entity';

describe('SequelizeStudentNeurodivergenciesRepository', () => {
  let repository: SequelizeStudentNeurodivergenciesRepository;
  let modelMock: any;

  beforeEach(async () => {
    modelMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      destroy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SequelizeStudentNeurodivergenciesRepository,
        {
          provide: getModelToken(StudentNeurodivergencyModel),
          useValue: modelMock,
        },
      ],
    }).compile();

    repository = module.get<SequelizeStudentNeurodivergenciesRepository>(SequelizeStudentNeurodivergenciesRepository);
  });

  describe('findByStudentId', () => {
    it('should correctly map created_at to createdAt', async () => {
      const date = new Date();
      const mockModel = {
        get: jest.fn().mockReturnValue({
          id: '1',
          studentId: 's1',
          neurodivergencyId: 'n1',
          created_at: date,
        }),
      };
      modelMock.findAll.mockResolvedValue([mockModel]);

      const result = await repository.findByStudentId('s1');

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(StudentNeurodivergency);
      expect(result[0].createdAt).toBe(date);
    });
  });
});
