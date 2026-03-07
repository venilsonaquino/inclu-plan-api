import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { SequelizeNeurodivergenciesRepository } from './sequelize-neurodivergencies.repository';
import { NeurodivergencyModel } from '../models/neurodivergency.model';
import { Neurodivergency } from '@/modules/neurodivergencies/domain/entities/neurodivergency.entity';

describe('SequelizeNeurodivergenciesRepository', () => {
  let repository: SequelizeNeurodivergenciesRepository;
  let neurodivergencyModelMock: any;

  beforeEach(async () => {
    neurodivergencyModelMock = {
      create: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SequelizeNeurodivergenciesRepository,
        {
          provide: getModelToken(NeurodivergencyModel),
          useValue: neurodivergencyModelMock,
        },
      ],
    }).compile();

    repository = module.get<SequelizeNeurodivergenciesRepository>(SequelizeNeurodivergenciesRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a neurodivergency', async () => {
      const neurodivergency = new Neurodivergency({
        name: 'Autismo',
        description: 'Transtorno do Espectro Autista',
      });

      await repository.create(neurodivergency);

      expect(neurodivergencyModelMock.create).toHaveBeenCalledWith({
        id: neurodivergency.id,
        name: neurodivergency.name,
        description: neurodivergency.description,
        createdAt: neurodivergency.createdAt,
        updatedAt: neurodivergency.updatedAt,
      });
    });
  });

  describe('findById', () => {
    it('should return a neurodivergency if found', async () => {
      const mockModel = {
        toDomain: jest.fn().mockReturnValue({ id: '1', name: 'Autismo' }),
      };
      neurodivergencyModelMock.findByPk.mockResolvedValue(mockModel);

      const result = await repository.findById('1');

      expect(neurodivergencyModelMock.findByPk).toHaveBeenCalledWith('1');
      expect(result).toEqual({ id: '1', name: 'Autismo' });
    });

    it('should return null if not found', async () => {
      neurodivergencyModelMock.findByPk.mockResolvedValue(null);

      const result = await repository.findById('1');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all neurodivergencies', async () => {
      const mockModel = {
        toDomain: jest.fn().mockReturnValue({ id: '1', name: 'Autismo' }),
      };
      neurodivergencyModelMock.findAll.mockResolvedValue([mockModel]);

      const result = await repository.findAll();

      expect(neurodivergencyModelMock.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ id: '1', name: 'Autismo' });
    });
  });

  describe('findByIds', () => {
    it('should return multiple neurodivergencies by ids', async () => {
      const mockModel = {
        toDomain: jest.fn().mockReturnValue({ id: '1', name: 'Autismo' }),
      };
      neurodivergencyModelMock.findAll.mockResolvedValue([mockModel]);

      const ids = ['1', '2'];
      const result = await repository.findByIds(ids);

      expect(neurodivergencyModelMock.findAll).toHaveBeenCalledWith({
        where: { id: { [Op.in]: ids } },
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ id: '1', name: 'Autismo' });
    });
  });
});
