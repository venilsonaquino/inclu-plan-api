import { PromptUtil } from './prompt.util';

describe('PromptUtil', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buildPromptContext', () => {
    it('should replace all placeholders correctly', () => {
      const template =
        'Theme: {{THEME}}, Obj: {{OBJECTIVE}}, Desc: {{DESCRIPTION}}, Name: {{STUDENT_NAME}}, Grade: {{STUDENT_GRADE}}, Profile: {{STUDENT_PROFILE}}, Adapt: {{STUDENT_ADAPTATION}}{{STRATEGY_OVERRIDE}}';
      const payload = {
        theme: 'Math',
        objective: 'Count',
        description: 'Test text',
        studentData: {
          name: 'John',
          grade: '1',
          profile: 'ADD',
          adaptation: 'Visual',
        },
      };

      const result = PromptUtil.buildPromptContext(template, payload);

      expect(result).toBe(
        'Theme: Math, Obj: Count, Desc: Test text, Name: John, Grade: 1, Profile: ADD, Adapt: Visual',
      );
    });

    it('should include strategy override if provided', () => {
      const template = '{{STRATEGY_OVERRIDE}}Content';
      const payload = {
        theme: 'Math',
        objective: 'Count',
        description: 'Test text',
        studentData: {
          name: 'John',
          grade: '1',
          profile: 'ADD',
          adaptation: 'Visual',
        },
        strategyOverride: 'Use colors',
      };

      const result = PromptUtil.buildPromptContext(template, payload);

      expect(result).toContain('DIRETRIZ OBRIGATÓRIA OVERRIDE:');
      expect(result).toContain('Use colors');
      expect(result).toContain('Content');
    });
  });
});
