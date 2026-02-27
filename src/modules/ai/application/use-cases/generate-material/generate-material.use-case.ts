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

  private buildPromptContext(template: string, payload: GenerateMaterialInput): string {
    return template
      .replace('{{ACTIVITY_TEXT}}', payload.activityText)
      .replace('{{STUDENT_NAME}}', payload.studentData.name)
      .replace('{{STUDENT_PROFILE}}', payload.studentData.profile);
  }

  private sanitizeAndParseJson(rawData: string | any): any {
    if (typeof rawData !== 'string') return rawData;

    let cleanedStr = rawData;
    const startIndex = cleanedStr.indexOf('{');
    const endIndex = cleanedStr.lastIndexOf('}');
    if (startIndex !== -1 && endIndex !== -1 && endIndex >= startIndex) {
      cleanedStr = cleanedStr.substring(startIndex, endIndex + 1);
    }

    try {
      return JSON.parse(cleanedStr);
    } catch (e) {
      this.logger.error("JSON parse error after generation", e);
      throw new Error("Invalid format received from AI.");
    }
  }

  private async fetchImagesForMaterial(materialData: any): Promise<void> {
    const imagePromises: Promise<void>[] = [];

    if (Array.isArray(materialData?.cards)) {
      const cardPromises = materialData.cards
        .filter((card: any) => card.imagePrompt)
        .map((card: any) =>
          this.geminiProvider.generateImage(card.imagePrompt)
            .then(base64 => { card.generatedImage = base64; })
            .catch(e => { this.logger.warn(`Card image failed: ${e.message}`); })
        );
      imagePromises.push(...cardPromises);
    }

    if (materialData?.board?.imagePrompt) {
      imagePromises.push(
        this.geminiProvider.generateImage(materialData.board.imagePrompt)
          .then(base64 => { materialData.board.generatedImage = base64; })
          .catch(e => { this.logger.warn(`Board image failed: ${e.message}`); })
      );
    }

    await Promise.all(imagePromises);
  }

  async execute(payload: GenerateMaterialInput): Promise<Result<GenerateMaterialOutput>> {
    try {
      const systemInstruction = this.loadPromptTemplate('generate-material.system.md');
      const basePrompt = this.loadPromptTemplate('generate-material.user.md');
      const promptText = this.buildPromptContext(basePrompt, payload);

      const rawAiResponse = await this.geminiProvider.generateText(systemInstruction, promptText);
      const materialData = this.sanitizeAndParseJson(rawAiResponse);

      await this.fetchImagesForMaterial(materialData);

      return Result.ok<GenerateMaterialOutput>(materialData);
    } catch (error) {
      this.logger.error('Failed to generate material', error);
      return Result.fail<GenerateMaterialOutput>(error instanceof Error ? error.message : 'Unknown error generating material');
    }
  }
}
