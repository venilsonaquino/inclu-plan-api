import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller';
import { CreateStudentUseCase } from '@/modules/students/application/use-cases/create-student/create-student.use-case';
import { Result } from '@/shared/domain/utils/result';

describe('StudentsController', () => {
  let controller: StudentsController;
  let useCase: CreateStudentUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        {
          provide: CreateStudentUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
    useCase = module.get<CreateStudentUseCase>(CreateStudentUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return 201 on success', async () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    jest.spyOn(useCase, 'execute').mockResolvedValue(Result.ok({ id: '1' } as any));
    await controller.create({ name: 'Student', gradeId: 'g1', profiles: [] }, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(201);
  });

  it('should return 400 on failure', async () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    jest.spyOn(useCase, 'execute').mockResolvedValue(Result.fail('Error'));
    await controller.create({ name: 'Student', gradeId: 'g1', profiles: [] }, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
});
