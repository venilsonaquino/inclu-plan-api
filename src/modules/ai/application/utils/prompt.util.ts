import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Logger } from '@nestjs/common';

const logger = new Logger('PromptUtil');

export class PromptUtil {
  static loadPromptTemplate(dirname: string, filename: string): string {
    try {
      const promptPath = join(dirname, 'prompts', filename);
      return readFileSync(promptPath, 'utf8');
    } catch (error) {
      logger.error(`Could not load prompt file: ${filename}`, error);
      throw new Error(`Failed to load prompt template: ${filename}`);
    }
  }

  static buildPromptContext(
    template: string,
    payload: {
      strategyOverride?: string;
      theme: string;
      objective: string;
      description: string;
      studentData: {
        name: string;
        grade: string;
        profile: string;
        adaptation: string;
      };
    },
  ): string {
    const override = payload.strategyOverride
      ? `\nDIRETRIZ OBRIGATÓRIA OVERRIDE:\n${payload.strategyOverride}\n`
      : '';
    return template
      .replace('{{THEME}}', payload.theme)
      .replace('{{OBJECTIVE}}', payload.objective)
      .replace('{{DESCRIPTION}}', payload.description)
      .replace('{{STUDENT_NAME}}', payload.studentData.name)
      .replace('{{STUDENT_GRADE}}', payload.studentData.grade)
      .replace('{{STUDENT_PROFILE}}', payload.studentData.profile)
      .replace('{{STUDENT_ADAPTATION}}', payload.studentData.adaptation)
      .replace('{{STRATEGY_OVERRIDE}}', override);
  }
}
