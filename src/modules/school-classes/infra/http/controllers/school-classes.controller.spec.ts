import { Test, TestingModule } from '@nestjs/testing';
import { SchoolClassesController } from './school-classes.controller';
import { CreateSchoolClassUseCase } from '@/modules/school-classes/application/use-cases/create-school-class/create-school-class.use-case';
import { Result } from '@/shared/domain/utils/result';

describe('SchoolClassesController', () => {
  let controller: SchoolClassesController;
  let useCase: CreateSchoolClassUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolClassesController],
      providers: [
        {
          provide: CreateSchoolClassUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<SchoolClassesController>(SchoolClassesController);
    useCase = module.get<CreateSchoolClassUseCase>(CreateSchoolClassUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return 201 on success', async () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    jest
      .spyOn(useCase, 'execute')
      .mockResolvedValue(Result.ok({ id: '1' } as any));
    await controller.create({ name: 'Class', teacherId: 't1' }, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(201);
  });

  it('should return 400 on failure', async () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    jest.spyOn(useCase, 'execute').mockResolvedValue(Result.fail('Error'));
    await controller.create({ name: 'Class', teacherId: 't1' }, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
});
