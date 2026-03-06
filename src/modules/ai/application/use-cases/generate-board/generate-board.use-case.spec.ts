import { Test, TestingModule } from '@nestjs/testing';
import { GenerateBoardUseCase } from './generate-board.use-case';
import { GeminiProvider } from '@/modules/ai/infra/integrations/gemini.provider';
import { I_MATERIAL_CACHE_REPOSITORY } from '@/modules/ai/domain/repositories/material-cache.repository.interface';
import { I_AI_PROVIDER } from '@/modules/ai/domain/providers/ai-provider.interface';
import { I_TEMPLATE_LOADER } from '@/modules/ai/domain/providers/template-loader.interface';

jest.mock('@/modules/ai/infra/integrations/gemini.provider');

describe('GenerateBoardUseCase', () => {
  let useCase: GenerateBoardUseCase;
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
        GenerateBoardUseCase,
        {
          provide: I_AI_PROVIDER,
          useClass: GeminiProvider,
        },
        {
          provide: I_TEMPLATE_LOADER,
          useValue: templateLoader,
        },
        {
          provide: I_MATERIAL_CACHE_REPOSITORY,
          useValue: materialCacheRepository,
        },
      ],
    }).compile();

    useCase = module.get<GenerateBoardUseCase>(GenerateBoardUseCase);
    geminiProvider = module.get(I_AI_PROVIDER) as jest.Mocked<GeminiProvider>;

    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return cached material if a similar request exists', async () => {
      const cachedResult = {
        board: { title: 'Prancha', text: 'Text', imagePrompt: 'Prompt' },
      };
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
        board: {
          title: 'Prancha Title',
          text: 'Text',
          imagePrompt: 'Step 1 image',
        },
      };
      geminiProvider.generateText.mockResolvedValue(aiResult as any);
      geminiProvider.generateImage.mockResolvedValue('base64StringMock');

      const result = await useCase.execute(mockPayload);

      expect(result.isSuccess).toBe(true);
      expect(geminiProvider.generateText).toHaveBeenCalledTimes(1);
      expect(geminiProvider.generateImage).toHaveBeenCalledTimes(1);

      const returnedValue = result.getValue();
      expect(returnedValue.board.generatedImage).toBe('base64StringMock');

      expect(materialCacheRepository.save).toHaveBeenCalled();
    });

    it('should handle inner generateImage failure gracefully (fallback to undefined image)', async () => {
      geminiProvider.generateEmbeddings.mockResolvedValue([0.1, 0.2] as any);
      materialCacheRepository.findSimilar.mockResolvedValue(null);
      geminiProvider.generateText.mockResolvedValue({
        board: { title: 'a', text: 'b', imagePrompt: 'c' },
      } as any);

      // Force image generation to throw error
      geminiProvider.generateImage.mockRejectedValue(new Error('Image AI offline'));

      const result = await useCase.execute(mockPayload);

      // We expect the result to still be successful, just without the image
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().board.generatedImage).toBeUndefined();
    });

    it('should respect strategyOverride into context mapping', async () => {
      geminiProvider.generateEmbeddings.mockResolvedValue([0.1, 0.2] as any);
      materialCacheRepository.findSimilar.mockResolvedValue(null);
      geminiProvider.generateText.mockResolvedValue({
        board: { title: 'a', text: 'b', imagePrompt: 'c' },
      } as any);

      const payloadOverride = {
        ...mockPayload,
        strategyOverride: 'Foco Visual',
      };

      await useCase.execute(payloadOverride);

      expect(geminiProvider.generateEmbeddings).toHaveBeenCalledWith(
        expect.stringContaining('Estratégia Substituta: Foco Visual'),
      );
    });
  });
});
