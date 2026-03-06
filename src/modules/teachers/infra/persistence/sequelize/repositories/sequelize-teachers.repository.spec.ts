import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { SequelizeTeachersRepository } from './sequelize-teachers.repository';
import { TeacherModel } from '../models/teacher.model';
import { Teacher } from '@/modules/teachers/domain/entities/teacher.entity';

describe('SequelizeTeachersRepository', () => {
  let repository: SequelizeTeachersRepository;
  let teacherModelMock: any;

  beforeEach(async () => {
    teacherModelMock = {
      create: jest.fn(),
      findByPk: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SequelizeTeachersRepository,
        {
          provide: getModelToken(TeacherModel),
          useValue: teacherModelMock,
        },
      ],
    }).compile();

    repository = module.get<SequelizeTeachersRepository>(SequelizeTeachersRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a teacher', async () => {
      const teacher = new Teacher({
        name: 'Jane Smith',
        email: 'jane@example.com',
        passwordHash: 'hashed_password',
      });

      await repository.create(teacher);

      expect(teacherModelMock.create).toHaveBeenCalledWith({
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        passwordHash: teacher.passwordHash,
        createdAt: teacher.createdAt,
        updatedAt: teacher.updatedAt,
      });
    });
  });

  describe('findByEmail', () => {
    it('should return a teacher if found', async () => {
      const mockModel = {
        toDomain: jest.fn().mockReturnValue({ id: '1', email: 'jane@example.com' }),
      };
      teacherModelMock.findOne.mockResolvedValue(mockModel);

      const result = await repository.findByEmail('jane@example.com');

      expect(teacherModelMock.findOne).toHaveBeenCalledWith({ where: { email: 'jane@example.com' } });
      expect(result).toEqual({ id: '1', email: 'jane@example.com' });
    });

    it('should return null if not found', async () => {
      teacherModelMock.findOne.mockResolvedValue(null);

      const result = await repository.findByEmail('jane@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a teacher if found', async () => {
      const mockModel = {
        toDomain: jest.fn().mockReturnValue({ id: '1', name: 'Jane' }),
      };
      teacherModelMock.findByPk.mockResolvedValue(mockModel);

      const result = await repository.findById('1');

      expect(teacherModelMock.findByPk).toHaveBeenCalledWith('1');
      expect(result).toEqual({ id: '1', name: 'Jane' });
    });

    it('should return null if not found', async () => {
      teacherModelMock.findByPk.mockResolvedValue(null);

      const result = await repository.findById('1');

      expect(result).toBeNull();
    });
  });
});
