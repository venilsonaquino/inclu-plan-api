import { Student } from '@/modules/students/domain/entities/student.entity';
import { LessonPromptBuilder } from './lesson-prompt-builder';

describe('LessonPromptBuilder', () => {
  const gradeMap = new Map([['grade-1', '3º Ano']]);
  const neuroMap = new Map([['neuro-1', 'TEA']]);

  const mockStudents: Student[] = [
    {
      id: '1',
      name: 'Joana',
      gradeId: 'grade-1',
      neurodivergencies: ['neuro-1'],
      notes: 'Notas de Joana',
    } as Student,
    {
      id: '2',
      name: 'Fulano',
      gradeId: 'unknown',
      neurodivergencies: [],
    } as Student,
  ];

  describe('buildStudentProfiles', () => {
    it('should format student profiles correctly with all info', () => {
      const result = LessonPromptBuilder.buildStudentProfiles([mockStudents[0]], gradeMap, neuroMap);
      expect(result).toContain('[PERFIL DE ALUNO]');
      expect(result).toContain('- NOME: Joana');
      expect(result).toContain('- SÉRIE: 3º Ano');
      expect(result).toContain('- NEURODIVERGÊNCIAS: TEA');
      expect(result).toContain('- NOTAS: Notas de Joana');
    });

    it('should handle missing grades and neurodivergencies', () => {
      const result = LessonPromptBuilder.buildStudentProfiles([mockStudents[1]], gradeMap, neuroMap);
      expect(result).toContain('- SÉRIE: Não informada');
      expect(result).toContain('- NEURODIVERGÊNCIAS: Sem neurodivergência especificada');
      expect(result).not.toContain('- NOTAS:');
    });
  });

  describe('buildBatchPrompt', () => {
    it('should format multiple lessons in a batch', () => {
      const lessons = [
        {
          discipline: 'Matemática',
          theme: 'Adição',
          observations: 'Obs 1',
          students: [mockStudents[0]],
        },
        {
          discipline: 'Português',
          theme: 'Vogais',
          students: [mockStudents[1]],
        },
      ];

      const result = LessonPromptBuilder.buildBatchPrompt(lessons, gradeMap, neuroMap);
      expect(result).toContain('### LIÇÃO 1: Matemática - Adição ###');
      expect(result).toContain('Observações: Obs 1');
      expect(result).toContain('### LIÇÃO 2: Português - Vogais ###');
      expect(result).toContain('---'); // Divider
    });
  });
});
