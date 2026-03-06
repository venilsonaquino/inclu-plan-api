import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { SequelizeSchoolClassesRepository } from './sequelize-school-classes.repository';
import { SchoolClassModel } from '../models/school-class.model';
import { SchoolClass } from '@/modules/school-classes/domain/entities/school-class.entity';

describe('SequelizeSchoolClassesRepository', () => {
  let repository: SequelizeSchoolClassesRepository;
  let schoolClassModelMock: any;

  beforeEach(async () => {
    schoolClassModelMock = {
      create: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SequelizeSchoolClassesRepository,
        {
          provide: getModelToken(SchoolClassModel),
          useValue: schoolClassModelMock,
        },
      ],
    }).compile();

    repository = module.get<SequelizeSchoolClassesRepository>(SequelizeSchoolClassesRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a school class', async () => {
      const schoolClass = new SchoolClass({
        name: 'Turma A',
        teacherId: 't1',
      });

      await repository.create(schoolClass);

      expect(schoolClassModelMock.create).toHaveBeenCalledWith({
        id: schoolClass.id,
        name: schoolClass.name,
        teacherId: schoolClass.teacherId,
        isActive: schoolClass.isActive,
        createdAt: schoolClass.createdAt,
        updatedAt: schoolClass.updatedAt,
      });
    });
  });

  describe('findById', () => {
    it('should return a school class if found', async () => {
      const mockModel = {
        toDomain: jest.fn().mockReturnValue({ id: '1', name: 'Turma A' }),
      };
      schoolClassModelMock.findByPk.mockResolvedValue(mockModel);

      const result = await repository.findById('1');

      expect(schoolClassModelMock.findByPk).toHaveBeenCalledWith('1');
      expect(result).toEqual({ id: '1', name: 'Turma A' });
    });

    it('should return null if not found', async () => {
      schoolClassModelMock.findByPk.mockResolvedValue(null);

      const result = await repository.findById('1');

      expect(result).toBeNull();
    });
  });

  describe('findByTeacherId', () => {
    it('should return school classes for a teacher', async () => {
      const mockModel = {
        toDomain: jest.fn().mockReturnValue({ id: '1', name: 'Turma A' }),
      };
      schoolClassModelMock.findAll.mockResolvedValue([mockModel]);

      const result = await repository.findByTeacherId('t1');

      expect(schoolClassModelMock.findAll).toHaveBeenCalledWith({
        where: { teacherId: 't1' },
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ id: '1', name: 'Turma A' });
    });
  });
});
