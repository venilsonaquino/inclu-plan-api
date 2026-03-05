import { PromptUtil } from './prompt.util';
import * as fs from 'node:fs';
import * as path from 'node:path';

jest.mock('node:fs');
jest.mock('node:path');

describe('PromptUtil', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadPromptTemplate', () => {
    it('should load prompt template successfully', () => {
      (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
      (fs.readFileSync as jest.Mock).mockReturnValue('mock template content');

      const result = PromptUtil.loadPromptTemplate('test-dir', 'test.md');

      expect(path.join).toHaveBeenCalledWith('test-dir', 'prompts', 'test.md');
      expect(fs.readFileSync).toHaveBeenCalledWith(
        'test-dir/prompts/test.md',
        'utf8',
      );
      expect(result).toBe('mock template content');
    });

    it('should throw an error and log if reading fails', () => {
      (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('File not found');
      });

      expect(() => {
        PromptUtil.loadPromptTemplate('test-dir', 'test.md');
      }).toThrow('Failed to load prompt template: test.md');
    });
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
