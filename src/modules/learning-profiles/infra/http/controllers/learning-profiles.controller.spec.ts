import { Test, TestingModule } from '@nestjs/testing';
import { LearningProfilesController } from './learning-profiles.controller';
import { CreateLearningProfileUseCase } from '@/modules/learning-profiles/application/use-cases/create-learning-profile/create-learning-profile.use-case';
import { Result } from '@/shared/domain/utils/result';

describe('LearningProfilesController', () => {
  let controller: LearningProfilesController;
  let useCase: CreateLearningProfileUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LearningProfilesController],
      providers: [
        {
          provide: CreateLearningProfileUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<LearningProfilesController>(
      LearningProfilesController,
    );
    useCase = module.get<CreateLearningProfileUseCase>(
      CreateLearningProfileUseCase,
    );
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
    await controller.create({ name: 'TEA', description: 'desc' }, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(201);
  });

  it('should return 400 on failure', async () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    jest
      .spyOn(useCase, 'execute')
      .mockResolvedValue(Result.fail('Error message'));
    await controller.create({ name: 'TEA', description: 'desc' }, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
});
