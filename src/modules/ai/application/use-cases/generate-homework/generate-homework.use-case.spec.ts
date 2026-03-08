import { Test, TestingModule } from '@nestjs/testing';
import { GenerateHomeworkUseCase } from './generate-homework.use-case';
import { GeminiProvider } from '@/modules/ai/infra/integrations/gemini.provider';
import { IMaterialCacheRepository } from '@/modules/ai/domain/repositories/material-cache.repository.interface';
import { IAiProvider } from '@/modules/ai/domain/providers/ai-provider.interface';
import { ITemplateLoader } from '@/modules/ai/domain/providers/template-loader.interface';

jest.mock('@/modules/ai/infra/integrations/gemini.provider');

describe('GenerateHomeworkUseCase', () => {
  let useCase: GenerateHomeworkUseCase;
  let geminiProvider: jest.Mocked<GeminiProvider>;
  let templateLoader: any;
  let materialCacheRepository: any;

  const mockPayload = {
    theme: 'Sistema Solar',
    objective: 'Aprender os planetas',
    description: 'Pintar',
    studentData: {
      name: 'Joana',
      grade: '1º Ano',
      profile: 'TEA',
      adaptation: 'Uso de massinha',
    },
  };

  beforeEach(async () => {
    materialCacheRepository = {
      findSimilar: jest.fn(),
      save: jest.fn(),
    };

    templateLoader = {
      load: jest.fn().mockResolvedValue('PROMPT CONTENT'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateHomeworkUseCase,
        {
          provide: IAiProvider,
          useClass: GeminiProvider,
        },
        {
          provide: ITemplateLoader,
          useValue: templateLoader,
        },
        {
          provide: IMaterialCacheRepository,
          useValue: materialCacheRepository,
        },
      ],
    }).compile();

    useCase = module.get<GenerateHomeworkUseCase>(GenerateHomeworkUseCase);
    geminiProvider = module.get(IAiProvider) as jest.Mocked<GeminiProvider>;

    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return cached material if a similar request exists', async () => {
      const cachedResult = { homework: { title: 'Lição', instructions: [] } };
      geminiProvider.generateEmbeddings.mockResolvedValue([0.1, 0.2] as any);
      materialCacheRepository.findSimilar.mockResolvedValue({
        id: '123',
        materialResult: cachedResult,
      });

      const result = await useCase.execute(mockPayload);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toEqual(cachedResult);
      expect(geminiProvider.generateText).not.toHaveBeenCalled();
    });

    it('should generate content, fetch images, and save to cache on a cache miss', async () => {
      geminiProvider.generateEmbeddings.mockResolvedValue([0.1, 0.2] as any);
      materialCacheRepository.findSimilar.mockResolvedValue(null);

      const aiResult = {
        homework: {
          title: 'Lição',
          instructions: 'instructions',
          materialsNeeded: 'materials',
          imagePrompt: 'Homework base image',
        },
      };
      geminiProvider.generateText.mockResolvedValue(aiResult as any);
      geminiProvider.generateImage.mockResolvedValue('base64StringMock');

      const result = await useCase.execute(mockPayload);

      expect(result.isSuccess).toBe(true);
      expect(geminiProvider.generateText).toHaveBeenCalledTimes(1);
      expect(geminiProvider.generateImage).toHaveBeenCalledTimes(1);

      const returnedValue = result.getValue();
      expect(returnedValue.homework.generatedImage).toBe('base64StringMock');

      expect(materialCacheRepository.save).toHaveBeenCalled();
    });

    it('should handle inner generateImage failure gracefully (fallback to undefined image)', async () => {
      geminiProvider.generateEmbeddings.mockResolvedValue([0.1, 0.2] as any);
      materialCacheRepository.findSimilar.mockResolvedValue(null);
      geminiProvider.generateText.mockResolvedValue({
        homework: { title: 'a', instructions: 'b', imagePrompt: 'c' },
      } as any);

      // Force image generation to throw error
      geminiProvider.generateImage.mockRejectedValue(new Error('Image AI offline'));

      const result = await useCase.execute(mockPayload);

      // We expect the result to still be successful, just without the image
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().homework.generatedImage).toBeUndefined();
    });

    it('should gracefully handle GeminiProvider failures', async () => {
      geminiProvider.generateEmbeddings.mockRejectedValue(new Error('API Down'));

      const result = await useCase.execute(mockPayload);

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('API Down');
    });

    it('should respect strategyOverride into context mapping', async () => {
      geminiProvider.generateEmbeddings.mockResolvedValue([0.1, 0.2] as any);
      materialCacheRepository.findSimilar.mockResolvedValue(null);
      geminiProvider.generateText.mockResolvedValue({
        homework: {
          title: 'a',
          instructions: 'b',
          materialsNeeded: 'c',
          imagePrompt: 'd',
        },
      } as any);

      const payloadOverride = {
        ...mockPayload,
        strategyOverride: 'Foco Sensório',
      };

      await useCase.execute(payloadOverride);

      expect(geminiProvider.generateEmbeddings).toHaveBeenCalledWith(
        expect.stringContaining('Estratégia Substituta: Foco Sensório'),
      );
    });
  });
});
