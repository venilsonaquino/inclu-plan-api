import { Test, TestingModule } from '@nestjs/testing';
import { GenerateCardsUseCase } from './generate-cards.use-case';
import { GeminiProvider } from '@/modules/ai/infra/integrations/gemini.provider';
import { I_MATERIAL_CACHE_REPOSITORY } from '@/modules/ai/domain/repositories/material-cache.repository.interface';
import * as fs from 'fs';

jest.mock('fs');
jest.mock('@/modules/ai/infra/integrations/gemini.provider');

describe('GenerateCardsUseCase', () => {
  let useCase: GenerateCardsUseCase;
  let geminiProvider: jest.Mocked<GeminiProvider>;
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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateCardsUseCase,
        GeminiProvider,
        {
          provide: I_MATERIAL_CACHE_REPOSITORY,
          useValue: materialCacheRepository,
        },
      ],
    }).compile();

    useCase = module.get<GenerateCardsUseCase>(GenerateCardsUseCase);
    geminiProvider = module.get(GeminiProvider) as jest.Mocked<GeminiProvider>;

    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return cached material if a similar request exists', async () => {
      const cachedResult = { cards: [{ title: 'Sol', text: 'Quente' }] };
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

      (fs.readFileSync as jest.Mock).mockReturnValue('PROMPT CONTENT');

      const aiResult = {
        cards: [
          { title: 'Sol', text: 'Estrela', imagePrompt: 'Desenho de sol' },
        ],
      };
      geminiProvider.generateText.mockResolvedValue(aiResult as any);
      geminiProvider.generateImage.mockResolvedValue('base64StringMock');

      const result = await useCase.execute(mockPayload);

      expect(result.isSuccess).toBe(true);
      expect(geminiProvider.generateText).toHaveBeenCalledTimes(1);
      expect(geminiProvider.generateImage).toHaveBeenCalledTimes(1);

      const returnedValue = result.getValue();
      expect(returnedValue.cards[0].generatedImage).toBe('base64StringMock');

      expect(materialCacheRepository.save).toHaveBeenCalled();
      const saveArg = materialCacheRepository.save.mock.calls[0][0];
      expect(saveArg.materialResult).toEqual(aiResult);
    });

    it('should gracefully handle GeminiProvider failures', async () => {
      geminiProvider.generateEmbeddings.mockRejectedValue(new Error('Embedding fail'));

      const result = await useCase.execute(mockPayload);

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Embedding fail');
    });

    it('should respect strategyOverride into context mapping', async () => {
      geminiProvider.generateEmbeddings.mockResolvedValue([0.1, 0.2] as any);
      materialCacheRepository.findSimilar.mockResolvedValue(null);
      (fs.readFileSync as jest.Mock).mockReturnValue('PROMPT CONTENT');
      geminiProvider.generateText.mockResolvedValue({ cards: [] } as any);

      const payloadOverride = { ...mockPayload, strategyOverride: 'Foco Visual' };

      await useCase.execute(payloadOverride);

      expect(geminiProvider.generateEmbeddings).toHaveBeenCalledWith(
        expect.stringContaining('Estratégia Substituta: Foco Visual')
      );
    });
  });
});
