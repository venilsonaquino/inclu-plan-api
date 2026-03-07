import { Test, TestingModule } from '@nestjs/testing';
import { GenerateLessonUseCase } from './generate-lesson.use-case';
import { I_AI_PROVIDER } from '@/modules/ai/domain/providers/ai-provider.interface';
import { I_TEMPLATE_LOADER } from '@/modules/ai/domain/providers/template-loader.interface';
import { I_LESSON_PLAN_REPOSITORY } from '@/modules/ai/domain/repositories/lesson-plan.repository.interface';
import { IStudentsRepository } from '@/modules/students/domain/repositories/students.repository';
import { IGradesRepository } from '@/modules/grades/domain/repositories/grades.repository';
import { INeurodivergenciesRepository } from '@/modules/neurodivergencies/domain/repositories/neurodivergencies.repository';

describe('GenerateLessonUseCase', () => {
  let useCase: GenerateLessonUseCase;
  let aiProvider: any;
  let templateLoader: any;
  let studentsRepository: any;
  let gradesRepository: any;
  let neurosRepository: any;
  let lessonPlanRepository: any;

  const mockStudent = {
    id: 'student-1',
    name: 'Joana',
    gradeId: 'grade-1',
    neurodivergencies: ['neuro-1'],
    notes: 'Precisa de apoio visual'
  };

  const mockPayload = {
    teacherId: 'teacher-1',
    lessons: [
      {
        discipline: { name: 'Matemática', theme: 'Frações', observations: 'Usar pizza' },
        students: ['student-1']
      }
    ]
  };

  beforeEach(async () => {
    aiProvider = { generateText: jest.fn() };
    templateLoader = { load: jest.fn().mockResolvedValue('MOCK TEMPLATE {{LESSONS_BATCH_STR}}') };
    studentsRepository = { findByIds: jest.fn().mockResolvedValue([mockStudent]) };
    gradesRepository = { findByIds: jest.fn().mockResolvedValue([{ id: 'grade-1', name: '3º Ano' }]) };
    neurosRepository = { findByIds: jest.fn().mockResolvedValue([{ id: 'neuro-1', name: 'TEA' }]) };
    lessonPlanRepository = { saveBatch: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateLessonUseCase,
        { provide: I_AI_PROVIDER, useValue: aiProvider },
        { provide: I_TEMPLATE_LOADER, useValue: templateLoader },
        { provide: I_LESSON_PLAN_REPOSITORY, useValue: lessonPlanRepository },
        { provide: IStudentsRepository, useValue: studentsRepository },
        { provide: IGradesRepository, useValue: gradesRepository },
        { provide: INeurodivergenciesRepository, useValue: neurosRepository },
      ],
    }).compile();

    useCase = module.get<GenerateLessonUseCase>(GenerateLessonUseCase);
  });

  describe('execute', () => {
    it('should successfully generate and persist lessons', async () => {
      const mockAiResponse = {
        lessons: [{
          objective: 'Obj',
          bncc: { code: 'BNCC', description: 'Desc' },
          duration: '45min',
          activity_steps: 'Steps',
          udl_strategies: { representation: 'R', action_and_expression: 'AE', engagement: 'E' },
          resources: 'Res',
          evaluation: 'Eval',
          adaptations: [{ student_neurodivergencies: 'TEA', strategy: 'S', behavioral_tips: 'B' }]
        }]
      };
      aiProvider.generateText.mockResolvedValue(mockAiResponse);

      const result = await useCase.execute(mockPayload);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toEqual(mockAiResponse);
      expect(lessonPlanRepository.saveBatch).toHaveBeenCalledTimes(1);
    });

    it('should return failure if AI fails', async () => {
      aiProvider.generateText.mockRejectedValue(new Error('AI Error'));

      const result = await useCase.execute(mockPayload);

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('AI Error');
    });

    it('should handle unknown error objects', async () => {
      aiProvider.generateText.mockRejectedValue('Strange error');

      const result = await useCase.execute(mockPayload);

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Unknown error in generation pipeline');
    });
  });
});
