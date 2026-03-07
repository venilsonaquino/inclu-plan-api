import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { SequelizeGradesRepository } from './sequelize-grades.repository';
import { GradeModel } from '../models/grade.model';
import { Grade } from '@/modules/grades/domain/entities/grade.entity';

describe('SequelizeGradesRepository', () => {
  let repository: SequelizeGradesRepository;
  let gradeModelMock: any;

  beforeEach(async () => {
    gradeModelMock = {
      create: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SequelizeGradesRepository,
        {
          provide: getModelToken(GradeModel),
          useValue: gradeModelMock,
        },
      ],
    }).compile();

    repository = module.get<SequelizeGradesRepository>(SequelizeGradesRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a grade', async () => {
      const grade = new Grade({
        name: '1º Ano',
        description: 'Primeiro ano do fundamental',
      });

      await repository.create(grade);

      expect(gradeModelMock.create).toHaveBeenCalledWith({
        id: grade.id,
        name: grade.name,
        description: grade.description,
        createdAt: grade.createdAt,
        updatedAt: grade.updatedAt,
      });
    });
  });

  describe('findById', () => {
    it('should return a grade if found', async () => {
      const mockModel = {
        toDomain: jest.fn().mockReturnValue({ id: '1', name: '1º Ano' }),
      };
      gradeModelMock.findByPk.mockResolvedValue(mockModel);

      const result = await repository.findById('1');

      expect(gradeModelMock.findByPk).toHaveBeenCalledWith('1');
      expect(result).toEqual({ id: '1', name: '1º Ano' });
    });

    it('should return null if not found', async () => {
      gradeModelMock.findByPk.mockResolvedValue(null);

      const result = await repository.findById('1');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all grades', async () => {
      const mockModel = {
        toDomain: jest.fn().mockReturnValue({ id: '1', name: '1º Ano' }),
      };
      gradeModelMock.findAll.mockResolvedValue([mockModel]);

      const result = await repository.findAll();

      expect(gradeModelMock.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ id: '1', name: '1º Ano' });
    });
  });

  describe('findByIds', () => {
    it('should return multiple grades by ids', async () => {
      const mockModel = {
        toDomain: jest.fn().mockReturnValue({ id: '1', name: '1º Ano' }),
      };
      gradeModelMock.findAll.mockResolvedValue([mockModel]);

      const ids = ['1', '2'];
      const result = await repository.findByIds(ids);

      expect(gradeModelMock.findAll).toHaveBeenCalledWith({
        where: { id: { [Op.in]: ids } },
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ id: '1', name: '1º Ano' });
    });
  });

  describe('findByName', () => {
    it('should return a grade if name matches', async () => {
      const mockModel = {
        toDomain: jest.fn().mockReturnValue({ id: '1', name: '1º Ano' }),
      };
      gradeModelMock.findOne.mockResolvedValue(mockModel);

      const result = await repository.findByName('1º Ano');

      expect(gradeModelMock.findOne).toHaveBeenCalledWith({ where: { name: '1º Ano' } });
      expect(result).toEqual({ id: '1', name: '1º Ano' });
    });

    it('should return null if name not found', async () => {
      gradeModelMock.findOne.mockResolvedValue(null);

      const result = await repository.findByName('1º Ano');

      expect(result).toBeNull();
    });
  });
});
