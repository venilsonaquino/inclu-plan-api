import { Test, TestingModule } from '@nestjs/testing';
import { GradesController } from './grades.controller';
import { CreateGradeUseCase } from '@/modules/grades/application/use-cases/create-grade/create-grade.use-case';
import { Result } from '@/shared/domain/utils/result';

describe('GradesController', () => {
  let controller: GradesController;
  let useCase: CreateGradeUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GradesController],
      providers: [
        {
          provide: CreateGradeUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<GradesController>(GradesController);
    useCase = module.get<CreateGradeUseCase>(CreateGradeUseCase);
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
    await controller.create({ name: 'test' }, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ id: '1' });
  });

  it('should return 400 on failure', async () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    jest.spyOn(useCase, 'execute').mockResolvedValue(Result.fail('Error message'));
    await controller.create({ name: 'test' }, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error message' });
  });
});
