import { Injectable, Logger, Inject } from '@nestjs/common';
import { GeminiProvider } from '@/modules/ai/infra/integrations/gemini.provider';
import { Result } from '@/shared/domain/utils/result';
import { GenerateMaterialInput } from '../generate-material/generate-material.input';
import { GenerateHomeworkOutput } from './generate-homework.output';
import * as fs from 'fs';
import * as path from 'path';
import { I_MATERIAL_CACHE_REPOSITORY, IMaterialCacheRepository } from '@/modules/ai/domain/repositories/material-cache.repository.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class GenerateHomeworkUseCase {
  private readonly logger = new Logger(GenerateHomeworkUseCase.name);

  constructor(
    private readonly geminiProvider: GeminiProvider,
    @Inject(I_MATERIAL_CACHE_REPOSITORY)
    private readonly materialCache: IMaterialCacheRepository,
  ) { }

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
      .replace('{{THEME}}', payload.theme)
      .replace('{{OBJECTIVE}}', payload.objective)
      .replace('{{DESCRIPTION}}', payload.description)
      .replace('{{STUDENT_NAME}}', payload.studentData.name)
      .replace('{{STUDENT_GRADE}}', payload.studentData.grade)
      .replace('{{STUDENT_PROFILE}}', payload.studentData.profile)
      .replace('{{STUDENT_ADAPTATION}}', payload.studentData.adaptation);
  }

  async execute(payload: GenerateMaterialInput): Promise<Result<GenerateHomeworkOutput>> {
    try {
      const contextHash = `${payload.theme}-${payload.studentData.grade}-${payload.studentData.profile}-HOMEWORK`;
      const semanticContextStr = `Objetivo: ${payload.objective}. Descrição: ${payload.description}. Adaptação: ${payload.studentData.adaptation}. Contexto: Lição de Casa.`;

      this.logger.log(`Checking semantic cache for Homework...`);
      const payloadEmbedding = await this.geminiProvider.generateEmbeddings(semanticContextStr);

      const cachedMaterial = await this.materialCache.findSimilar(contextHash, payloadEmbedding, 0.95);

      if (cachedMaterial) {
        this.logger.log(`CACHE HIT! Reusing Homework id ${cachedMaterial.id}`);
        return Result.ok<GenerateHomeworkOutput>(cachedMaterial.materialResult);
      }

      this.logger.log(`CACHE MISS. Generating new Homework from scratch...`);

      const systemInstruction = this.loadPromptTemplate('generate-homework.system.md');
      const basePrompt = this.loadPromptTemplate('generate-material.user.md');
      const promptText = this.buildPromptContext(basePrompt, payload);

      const rawAiResponse = await this.geminiProvider.generateText(systemInstruction, promptText);
      const homeworkData = rawAiResponse as GenerateHomeworkOutput;

      if (homeworkData.homework?.imagePrompt) {
        this.logger.log(`Fetching AI Images for Homework...`);
        try {
          homeworkData.homework.generatedImage = await this.geminiProvider.generateImage(homeworkData.homework.imagePrompt);
        } catch (e) {
          this.logger.warn(`Homework image failed: ${e.message}`);
        }
      }

      await this.materialCache.save({
        id: randomUUID(),
        contextHash,
        payloadEmbedding,
        materialResult: homeworkData
      });

      return Result.ok<GenerateHomeworkOutput>(homeworkData);
    } catch (error) {
      this.logger.error('Failed to generate homework', error);
      return Result.fail<GenerateHomeworkOutput>(error instanceof Error ? error.message : 'Unknown error');
    }
  }
}
