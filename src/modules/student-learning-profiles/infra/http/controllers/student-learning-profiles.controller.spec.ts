import { Test, TestingModule } from '@nestjs/testing';
import { StudentLearningProfilesController } from './student-learning-profiles.controller';
import { AssignProfileToStudentUseCase } from '@/modules/student-learning-profiles/application/use-cases/assign-profile-to-student/assign-profile-to-student.use-case';
import { Result } from '@/shared/domain/utils/result';

describe('StudentLearningProfilesController', () => {
  let controller: StudentLearningProfilesController;
  let useCase: AssignProfileToStudentUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentLearningProfilesController],
      providers: [
        {
          provide: AssignProfileToStudentUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<StudentLearningProfilesController>(StudentLearningProfilesController);
    useCase = module.get<AssignProfileToStudentUseCase>(AssignProfileToStudentUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return 201 on success', async () => {
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    jest.spyOn(useCase, 'execute').mockResolvedValue(Result.ok({ id: '1' } as any));
    await controller.assign({ studentId: 'stu', learningProfileId: 'prof' }, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(201);
  });

  it('should return 400 on failure', async () => {
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    jest.spyOn(useCase, 'execute').mockResolvedValue(Result.fail('Error'));
    await controller.assign({ studentId: 'stu', learningProfileId: 'prof' }, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
});
