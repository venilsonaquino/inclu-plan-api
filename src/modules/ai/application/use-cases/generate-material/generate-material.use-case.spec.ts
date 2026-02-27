import { Test, TestingModule } from '@nestjs/testing';
import { GenerateMaterialUseCase } from './generate-material.use-case';
import { GeminiProvider } from '@/modules/ai/infra/integrations/gemini.provider';
import * as fs from 'fs';

jest.mock('fs');
jest.mock('@/modules/ai/infra/integrations/gemini.provider');

describe('GenerateMaterialUseCase', () => {
  let useCase: GenerateMaterialUseCase;
  let geminiProvider: jest.Mocked<GeminiProvider>;

  const mockPayload = {
    activityText: 'Fazer bolo de chocolate',
    studentData: {
      name: 'João',
      profile: 'TDAH',
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenerateMaterialUseCase, GeminiProvider],
    }).compile();

    useCase = module.get<GenerateMaterialUseCase>(GenerateMaterialUseCase);
    geminiProvider = module.get(GeminiProvider) as jest.Mocked<GeminiProvider>;

    jest.clearAllMocks();
  });

  describe('loadPromptTemplate', () => {
    it('should throw an error if file reading fails', async () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('File reading error');
      });

      const result = await useCase.execute(mockPayload);
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Failed to load prompt template: generate-material.system.md');
    });
  });

  describe('execute', () => {
    it('should successfully build prompt strings, generate texts and images, and return Result', async () => {
      // Mock templates
      (fs.readFileSync as jest.Mock).mockImplementation((pathStr: string) => {
        if (pathStr.includes('system.md')) return 'SYSTEM MAT';
        if (pathStr.includes('user.md')) return 'USER MAT \\n {{ACTIVITY_TEXT}} \\n {{STUDENT_NAME}} \\n {{STUDENT_PROFILE}}';
        return '';
      });

      const mockAiOutputTextAsObject = {
        board: { title: 'Bolo', imagePrompt: 'draw a cake' },
        cards: [
          { keyword: 'Chocolate', imagePrompt: 'draw chocolate' },
          { keyword: 'Ovo', imagePrompt: 'draw an egg' }
        ]
      };

      geminiProvider.generateText.mockResolvedValue(mockAiOutputTextAsObject);

      geminiProvider.generateImage.mockImplementation(async (prompt) => {
        if (prompt === 'draw a cake') return 'base64cake';
        if (prompt === 'draw chocolate') return 'base64choco';
        if (prompt === 'draw an egg') return 'base64egg';
        return null;
      });

      const result = await useCase.execute(mockPayload);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.getValue().board.generatedImage).toBe('base64cake');
        expect(result.getValue().cards[0].generatedImage).toBe('base64choco');
        expect(result.getValue().cards[1].generatedImage).toBe('base64egg');
      }

      expect(geminiProvider.generateText).toHaveBeenCalledTimes(1);
      const callArgs = geminiProvider.generateText.mock.calls[0];
      expect(callArgs[0]).toBe('SYSTEM MAT');
      expect(callArgs[1]).toContain('Fazer bolo de chocolate');
      expect(callArgs[1]).toContain('João');
      expect(callArgs[1]).toContain('TDAH');

      // Should have been called 3 times (1 board + 2 cards)
      expect(geminiProvider.generateImage).toHaveBeenCalledTimes(3);
    });

    it('should parse string literal JSON wrapped in markdown correctly', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('mock');

      const mockStringPayload = `
      Here is the result:
      \`\`\`json
      {
        "board": { "title": "Test", "imagePrompt": "prompt board" },
        "cards": [{ "keyword": "Test Card" }]
      }
      \`\`\`
      Enjoy!`;

      geminiProvider.generateText.mockResolvedValue(mockStringPayload as any);
      geminiProvider.generateImage.mockResolvedValue('image64');

      const result = await useCase.execute(mockPayload);
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.getValue().board.title).toBe('Test');
        expect(result.getValue().board.generatedImage).toBe('image64');
      }
    });

    it('should return failure if string parsing fails', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('mock');
      geminiProvider.generateText.mockResolvedValue('invalid { JSON } no quotes }');

      const result = await useCase.execute(mockPayload);
      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Invalid format received from AI.');
    });

    it('should handle image generation partial failures without aborting the whole usecase', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('mock');

      geminiProvider.generateText.mockResolvedValue({
        board: { title: 'Test', imagePrompt: 'do fail board' },
        cards: [
          { title: 'Pass', imagePrompt: 'do pass' },
          { title: 'Fail Card', imagePrompt: 'do fail card' }
        ]
      } as any);

      geminiProvider.generateImage.mockImplementation(async (prompt) => {
        if (prompt === 'do fail board') throw new Error('Network Error Server');
        if (prompt === 'do fail card') throw new Error('Banned word');
        if (prompt === 'do pass') return 'success64';
        return null;
      });

      const result = await useCase.execute(mockPayload);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        // Should not have the image
        expect(result.getValue().board.generatedImage).toBeUndefined();
        expect(result.getValue().cards[1].generatedImage).toBeUndefined();
        // But should have the valid one
        expect(result.getValue().cards[0].generatedImage).toBe('success64');
      }
    });

    it('should handle general text AI errors upstream', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('mock');
      geminiProvider.generateText.mockRejectedValue(new Error('AI limit reached'));

      const result = await useCase.execute(mockPayload);

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('AI limit reached');
    });

    it('should fallback to Unknown Error when a hard crash occurs not typed as Error', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('mock');
      geminiProvider.generateText.mockRejectedValue('String Crash');

      const result = await useCase.execute(mockPayload);

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Unknown error generating material');
    });
  });
});
