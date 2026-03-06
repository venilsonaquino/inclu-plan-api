import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from './ai.controller';
import { GenerateLessonUseCase } from '@/modules/ai/application/use-cases/generate-lesson/generate-lesson.use-case';
import { GenerateCardsUseCase } from '@/modules/ai/application/use-cases/generate-cards/generate-cards.use-case';
import { GenerateBoardUseCase } from '@/modules/ai/application/use-cases/generate-board/generate-board.use-case';
import { GenerateHomeworkUseCase } from '@/modules/ai/application/use-cases/generate-homework/generate-homework.use-case';
import { Result } from '@/shared/domain/utils/result';
import { HttpException } from '@nestjs/common';

describe('AiController', () => {
  let controller: AiController;
  let generateLessonUseCase: any;
  let generateCardsUseCase: any;
  let generateBoardUseCase: any;
  let generateHomeworkUseCase: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [
        { provide: GenerateLessonUseCase, useValue: { execute: jest.fn() } },
        { provide: GenerateCardsUseCase, useValue: { execute: jest.fn() } },
        { provide: GenerateBoardUseCase, useValue: { execute: jest.fn() } },
        { provide: GenerateHomeworkUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    controller = module.get<AiController>(AiController);
    generateLessonUseCase = module.get(GenerateLessonUseCase);
    generateCardsUseCase = module.get(GenerateCardsUseCase);
    generateBoardUseCase = module.get(GenerateBoardUseCase);
    generateHomeworkUseCase = module.get(GenerateHomeworkUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateLessonPlan', () => {
    it('should return value on success', async () => {
      const mockResult = Result.ok({ days: [] } as any);
      generateLessonUseCase.execute.mockResolvedValue(mockResult);

      const result = await controller.generateLessonPlan({ some: 'input' });

      expect(result).toEqual({ days: [] });
    });

    it('should throw HttpException on failure', async () => {
      const mockResult = Result.fail('error');
      generateLessonUseCase.execute.mockResolvedValue(mockResult);

      await expect(controller.generateLessonPlan({})).rejects.toThrow(HttpException);
    });
  });

  describe('generateCards', () => {
    it('should return value on success', async () => {
      const mockResult = Result.ok({ cards: [] } as any);
      generateCardsUseCase.execute.mockResolvedValue(mockResult);

      const result = await controller.generateCards({} as any);

      expect(result).toEqual({ cards: [] });
    });

    it('should throw HttpException on failure', async () => {
      const mockResult = Result.fail('error');
      generateCardsUseCase.execute.mockResolvedValue(mockResult);

      await expect(controller.generateCards({} as any)).rejects.toThrow(HttpException);
    });
  });

  describe('generateBoard', () => {
    it('should return value on success', async () => {
      const mockResult = Result.ok({ board: {} } as any);
      generateBoardUseCase.execute.mockResolvedValue(mockResult);

      const result = await controller.generateBoard({} as any);

      expect(result).toEqual({ board: {} });
    });

    it('should throw HttpException on failure', async () => {
      const mockResult = Result.fail('error');
      generateBoardUseCase.execute.mockResolvedValue(mockResult);

      await expect(controller.generateBoard({} as any)).rejects.toThrow(HttpException);
    });
  });

  describe('generateHomework', () => {
    it('should return value on success', async () => {
      const mockResult = Result.ok({ homework: {} } as any);
      generateHomeworkUseCase.execute.mockResolvedValue(mockResult);

      const result = await controller.generateHomework({} as any);

      expect(result).toEqual({ homework: {} });
    });

    it('should throw HttpException on failure', async () => {
      const mockResult = Result.fail('error');
      generateHomeworkUseCase.execute.mockResolvedValue(mockResult);

      await expect(controller.generateHomework({} as any)).rejects.toThrow(HttpException);
    });
  });
});
