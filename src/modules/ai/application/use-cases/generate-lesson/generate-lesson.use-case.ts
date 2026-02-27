import { Injectable, Logger } from '@nestjs/common';
import { GeminiProvider } from '@/modules/ai/infra/integrations/gemini.provider';
import { Result } from '@/shared/domain/utils/result';
import { GenerateLessonInput } from './generate-lesson.input';
import { GenerateLessonOutput } from './generate-lesson.output';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GenerateLessonUseCase {
  private readonly logger = new Logger(GenerateLessonUseCase.name);

  constructor(private readonly geminiProvider: GeminiProvider) { }

  private loadPromptTemplate(filename: string): string {
    try {
      // Usaremos o diretorio atual do arquivo ao compilar para acessar os prompts
      const promptPath = path.join(__dirname, 'prompts', filename);
      return fs.readFileSync(promptPath, 'utf8');
    } catch (error) {
      this.logger.error(`Could not load prompt file: ${filename}`, error);
      throw new Error(`Failed to load prompt template: ${filename}`);
    }
  }

  async execute(payload: GenerateLessonInput): Promise<Result<GenerateLessonOutput>> {
    try {
      const alunosStr = payload.students
        .map((s) => `- NOME: ${s.name} | SÉRIE/ANO: ${s.grade || 'Não informada'} | PERFIL: ${s.profiles.join(', ')}`)
        .join('\n');

      let contentsStr = '';
      if (payload.days && payload.days.length > 0) {
        payload.days.forEach(d => {
          contentsStr += `[${d.day}]\n`;
          d.disciplines.forEach(disc => {
            contentsStr += `  - ${disc.name} (Tema: ${disc.theme})`;
            if (disc.observations) {
              contentsStr += ` | Observações: ${disc.observations}`;
            }
            contentsStr += '\n';
          });
          contentsStr += '\n';
        });
      }

      const systemInstruction = this.loadPromptTemplate('generate-lesson.system.md');
      let promptText = this.loadPromptTemplate('generate-lesson.user.md');

      // Inject variables
      promptText = promptText
        .replace('{{CONTENTS_STR}}', contentsStr)
        .replace('{{STUDENTS_STR}}', alunosStr);

      const aiResponse = await this.geminiProvider.generateText(systemInstruction, promptText, payload.imagePart);
      return Result.ok<GenerateLessonOutput>(aiResponse);
    } catch (error) {
      this.logger.error('Failed to generate lesson', error);
      return Result.fail<GenerateLessonOutput>(error instanceof Error ? error.message : 'Unknown error generating lesson');
    }
  }
}
