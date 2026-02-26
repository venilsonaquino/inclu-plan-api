import { Injectable, Logger } from '@nestjs/common';
import { GeminiProvider } from '@/modules/ai/infra/integrations/gemini.provider';
import { Result } from '@/shared/domain/utils/result';
import { GenerateMaterialInput } from './generate-material.input';
import { GenerateMaterialOutput } from './generate-material.output';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GenerateMaterialUseCase {
  private readonly logger = new Logger(GenerateMaterialUseCase.name);

  constructor(private readonly geminiProvider: GeminiProvider) { }

  private loadPromptTemplate(filename: string): string {
    try {
      const promptPath = path.join(__dirname, 'prompts', filename);
      return fs.readFileSync(promptPath, 'utf8');
    } catch (error) {
      this.logger.error(`Could not load prompt file: ${filename}`, error);
      throw new Error(`Failed to load prompt template: ${filename}`);
    }
  }

  async execute(payload: GenerateMaterialInput): Promise<Result<GenerateMaterialOutput>> {
    try {
      const systemInstruction = this.loadPromptTemplate('generate-material.system.md');
      let promptText = this.loadPromptTemplate('generate-material.user.md');

      promptText = promptText
        .replace('{{ACTIVITY_TEXT}}', payload.activityText)
        .replace('{{STUDENT_NAME}}', payload.studentData.name)
        .replace('{{STUDENT_PROFILE}}', payload.studentData.profile);

      let materialData = await this.geminiProvider.generateText(systemInstruction, promptText);

      if (typeof materialData === 'string') {
        try {
          let cleanedStr = materialData;
          const startIndex = cleanedStr.indexOf('{');
          const endIndex = cleanedStr.lastIndexOf('}');
          if (startIndex !== -1 && endIndex !== -1 && endIndex >= startIndex) {
            cleanedStr = cleanedStr.substring(startIndex, endIndex + 1);
          }
          materialData = JSON.parse(cleanedStr);
        } catch (e) {
          this.logger.error("JSON parse error after generation", e);
          throw new Error("Invalid format received from AI.");
        }
      }

      // 2. Fetch images in parallel
      const imagePromises: Promise<void>[] = [];

      // Ensure array exists
      if (materialData.cards && Array.isArray(materialData.cards)) {
        for (const card of materialData.cards) {
          if (card.imagePrompt) {
            const p = this.geminiProvider.generateImage(card.imagePrompt)
              .then(base64 => { card.generatedImage = base64; })
              .catch(e => { this.logger.warn(`Card image failed: ${e.message}`); });
            imagePromises.push(p);
          }
        }
      }

      if (materialData.board && materialData.board.imagePrompt) {
        const p = this.geminiProvider.generateImage(materialData.board.imagePrompt)
          .then(base64 => { materialData.board.generatedImage = base64; })
          .catch(e => { this.logger.warn(`Board image failed: ${e.message}`); });
        imagePromises.push(p);
      }

      // Await all parallel generation calls
      await Promise.all(imagePromises);

      return Result.ok<GenerateMaterialOutput>(materialData);
    } catch (error) {
      this.logger.error('Failed to generate material', error);
      return Result.fail<GenerateMaterialOutput>(error instanceof Error ? error.message : 'Unknown error generating material');
    }
  }
}
