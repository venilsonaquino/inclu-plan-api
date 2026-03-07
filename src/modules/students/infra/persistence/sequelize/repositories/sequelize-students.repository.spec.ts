import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { SequelizeStudentsRepository } from './sequelize-students.repository';
import { StudentModel } from '../models/student.model';
import { NeurodivergencyModel } from '@/modules/neurodivergencies/infra/persistence/sequelize/models/neurodivergency.model';
import { StudentNeurodivergencyModel } from '@/modules/student-neurodivergencies/infra/persistence/sequelize/models/student-neurodivergency.model';
import { Student } from '@/modules/students/domain/entities/student.entity';

describe('SequelizeStudentsRepository', () => {
  let repository: SequelizeStudentsRepository;
  let studentModelMock: any;
  let neurodivergencyModelMock: any;
  let pivotModelMock: any;
  let sequelizeMock: any;
  let transactionMock: any;

  beforeEach(async () => {
    transactionMock = {
      commit: jest.fn(),
      rollback: jest.fn(),
    };

    sequelizeMock = {
      transaction: jest.fn().mockResolvedValue(transactionMock),
    };

    studentModelMock = {
      create: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
    };

    neurodivergencyModelMock = {};
    pivotModelMock = {
      bulkCreate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SequelizeStudentsRepository,
        {
          provide: getModelToken(StudentModel),
          useValue: studentModelMock,
        },
        {
          provide: getModelToken(NeurodivergencyModel),
          useValue: neurodivergencyModelMock,
        },
        {
          provide: getModelToken(StudentNeurodivergencyModel),
          useValue: pivotModelMock,
        },
        {
          provide: Sequelize,
          useValue: sequelizeMock,
        },
      ],
    }).compile();

    repository = module.get<SequelizeStudentsRepository>(SequelizeStudentsRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a student without neurodivergencies', async () => {
      const student = new Student({
        name: 'John Doe',
        gradeId: 'g1',
        schoolClassId: 'c1',
      });

      await repository.create(student);

      expect(sequelizeMock.transaction).toHaveBeenCalled();
      expect(studentModelMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: student.id,
          name: student.name,
        }),
        { transaction: transactionMock },
      );
      expect(pivotModelMock.bulkCreate).not.toHaveBeenCalled();
      expect(transactionMock.commit).toHaveBeenCalled();
    });

    it('should create a student with neurodivergencies', async () => {
      const student = new Student({
        name: 'John Doe',
        gradeId: 'g1',
        schoolClassId: 'c1',
        neurodivergencies: ['n1', 'n2'],
      });

      await repository.create(student);

      expect(studentModelMock.create).toHaveBeenCalled();
      expect(pivotModelMock.bulkCreate).toHaveBeenCalledWith(
        [
          { studentId: student.id, neurodivergencyId: 'n1', notes: 'Auto-linked on student creation' },
          { studentId: student.id, neurodivergencyId: 'n2', notes: 'Auto-linked on student creation' },
        ],
        { transaction: transactionMock },
      );
      expect(transactionMock.commit).toHaveBeenCalled();
    });

    it('should rollback transaction if error occurs', async () => {
      const student = new Student({
        name: 'John Doe',
        gradeId: 'g1',
        schoolClassId: 'c1',
      });
      studentModelMock.create.mockRejectedValue(new Error('DB Error'));

      await expect(repository.create(student)).rejects.toThrow('DB Error');

      expect(transactionMock.rollback).toHaveBeenCalled();
      expect(transactionMock.commit).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a student if found', async () => {
      const mockModel = {
        toDomain: jest.fn().mockReturnValue({ id: '1', name: 'John' }),
      };
      studentModelMock.findByPk.mockResolvedValue(mockModel);

      const result = await repository.findById('1');

      expect(studentModelMock.findByPk).toHaveBeenCalledWith('1', {
        include: [NeurodivergencyModel],
      });
      expect(result).toEqual({ id: '1', name: 'John' });
    });

    it('should return null if not found', async () => {
      studentModelMock.findByPk.mockResolvedValue(null);

      const result = await repository.findById('1');

      expect(result).toBeNull();
    });
  });

  describe('findByClassId', () => {
    it('should return students for a class', async () => {
      const mockModel = {
        toDomain: jest.fn().mockReturnValue({ id: '1', name: 'John' }),
      };
      studentModelMock.findAll.mockResolvedValue([mockModel]);

      const result = await repository.findByClassId('c1');

      expect(studentModelMock.findAll).toHaveBeenCalledWith({
        where: { schoolClassId: 'c1' },
        include: [NeurodivergencyModel],
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ id: '1', name: 'John' });
    });
  });

  describe('findByIds', () => {
    it('should return multiple students by ids', async () => {
      const mockModel = {
        toDomain: jest.fn().mockReturnValue({ id: '1', name: 'John' }),
      };
      studentModelMock.findAll.mockResolvedValue([mockModel]);

      const ids = ['1', '2'];
      const result = await repository.findByIds(ids);

      expect(studentModelMock.findAll).toHaveBeenCalledWith({
        where: { id: { [Op.in]: ids } },
        include: [NeurodivergencyModel],
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ id: '1', name: 'John' });
    });
  });
});
