import { Test, TestingModule } from '@nestjs/testing';
import { GenerateLessonUseCase } from './generate-lesson.use-case';
import { GeminiProvider } from '@/modules/ai/infra/integrations/gemini.provider';
import { ILessonPlanRepository, I_LESSON_PLAN_REPOSITORY } from '@/modules/ai/domain/repositories/lesson-plan.repository.interface';
import * as fs from 'fs';

jest.mock('fs');
jest.mock('@/modules/ai/infra/integrations/gemini.provider');

describe('GenerateLessonUseCase', () => {
  let useCase: GenerateLessonUseCase;
  let geminiProvider: jest.Mocked<GeminiProvider>;
  let lessonRepository: jest.Mocked<ILessonPlanRepository>;

  const mockPayload = {
    students: [
      { name: 'Enzo', grade: '3º Ano', profiles: ['TEA', 'TDAH'] },
    ],
    days: [
      {
        day: 'Segunda-feira',
        disciplines: [
          { name: 'Portal da Matemática', theme: 'Frações', observations: 'Usar material dourado' },
        ],
      }
    ],
  };

  beforeEach(async () => {
    const mockLessonRepository = {
      findSimilar: jest.fn(),
      save: jest.fn(),
      clear: jest.fn(),
      count: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateLessonUseCase,
        GeminiProvider,
        {
          provide: I_LESSON_PLAN_REPOSITORY,
          useValue: mockLessonRepository,
        }
      ],
    }).compile();

    useCase = module.get<GenerateLessonUseCase>(GenerateLessonUseCase);
    geminiProvider = module.get(GeminiProvider) as jest.Mocked<GeminiProvider>;
    lessonRepository = module.get(I_LESSON_PLAN_REPOSITORY) as jest.Mocked<ILessonPlanRepository>;

    jest.clearAllMocks();

    // Default mock for RAG
    geminiProvider.generateEmbeddings.mockResolvedValue([0.1, 0.2]);
    lessonRepository.findSimilar.mockResolvedValue(null);
  });

  describe('loadPromptTemplate', () => {
    it('should throw an error if file reading fails', async () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('File not found');
      });

      const result = await useCase.execute(mockPayload);
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Failed to load prompt template');
    });
  });

  describe('execute', () => {
    it('should successfully build prompt strings and return AI result', async () => {
      // Mock raw template files
      (fs.readFileSync as jest.Mock).mockImplementation((pathStr: string) => {
        if (pathStr.includes('system.md')) return 'SYSTEM PROMPT';
        if (pathStr.includes('user.md')) return 'USER PROMPT \\n {{CONTENTS_STR}} \\n {{STUDENTS_STR}}';
        return '';
      });

      const mockAiOutput = { days: [{ day: 'Segunda', subjects: [] }] };
      geminiProvider.generateText.mockResolvedValue(mockAiOutput as any);

      const result = await useCase.execute(mockPayload);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toEqual(mockAiOutput);
      expect(geminiProvider.generateText).toHaveBeenCalledTimes(1);
      expect(lessonRepository.save).toHaveBeenCalledTimes(1);

      const callArgs = geminiProvider.generateText.mock.calls[0];
      // Arg 0 is system prompt
      expect(callArgs[0]).toBe('SYSTEM PROMPT');
      // Arg 1 is user prompt, verify that injected tags have been replaced
      expect(callArgs[1]).toContain('Portal da Matemática (Tema: Frações) | Observações: Usar material dourado');
      expect(callArgs[1]).toContain('- NOME: Enzo | SÉRIE/ANO: 3º Ano | PERFIL: TEA, TDAH');
    });

    it('should use the local RAG Memory cache on identical payload without hitting Gemini LLM', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('mock prompt');
      const mockAiOutput = { days: [{ day: 'Tuesday', subjects: [] }] };
      geminiProvider.generateText.mockResolvedValue(mockAiOutput as any);

      // Simulate that the repository finds a similar cache hit (second behavior logic)
      lessonRepository.findSimilar.mockResolvedValue({
        id: '1234',
        studentContextHash: 'hash123',
        contentEmbedding: [0.1, 0.2],
        lessonResult: mockAiOutput as any
      });

      // Chamada com Cache (Custo Zero - RAG Cache)
      const result2 = await useCase.execute(mockPayload);

      expect(result2.isSuccess).toBe(true);
      expect(result2.getValue()).toEqual(mockAiOutput);

      // O Gemini NAO PODE ter sido chamado (geração de texto), pois pegou do Cache
      expect(geminiProvider.generateText).not.toHaveBeenCalled();
      expect(lessonRepository.findSimilar).toHaveBeenCalledTimes(1);
      expect(lessonRepository.save).not.toHaveBeenCalled(); // No save on cache hit
    });

    it('should handle students without grades', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('mock prompt {{STUDENTS_STR}}');
      geminiProvider.generateText.mockResolvedValue({} as any);

      const payloadNoGrade = {
        students: [{ name: 'Maria', grade: '', profiles: [] }],
        days: []
      };

      await useCase.execute(payloadNoGrade);

      const callArgs = geminiProvider.generateText.mock.calls[0];
      expect(callArgs[1]).toContain('SÉRIE/ANO: Não informada');
    });

    it('should return a failure Result if GeminiProvider throws an exception', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('mock prompt');
      geminiProvider.generateText.mockRejectedValue(new Error('AI is down'));

      const result = await useCase.execute(mockPayload);

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('AI is down');
    });

    it('should return a fallback failure string if unknown error occurs', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('mock prompt');
      geminiProvider.generateText.mockRejectedValue('Strange String Error'); // Not an instance of Error

      const result = await useCase.execute(mockPayload);

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Unknown error generating lesson');
    });
  });
});
