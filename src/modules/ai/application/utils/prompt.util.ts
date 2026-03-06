import { PromptPayloadDto } from '../dtos/prompt-payload.dto';

export class PromptUtil {
  static buildPromptContext(template: string, payload: PromptPayloadDto): string {
    const override = payload.strategyOverride ? `\nDIRETRIZ OBRIGATÓRIA OVERRIDE:\n${payload.strategyOverride}\n` : '';
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
