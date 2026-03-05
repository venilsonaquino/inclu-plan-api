import { Injectable, Logger, Inject } from '@nestjs/common';
import { GeminiProvider } from '@/modules/ai/infra/integrations/gemini.provider';
import { Result } from '@/shared/domain/utils/result';
import { GenerateHomeworkInput } from './generate-homework.input';
import { GenerateHomeworkOutput } from './generate-homework.output';
import { PromptUtil } from '../../utils/prompt.util';
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

  async execute(payload: GenerateHomeworkInput): Promise<Result<GenerateHomeworkOutput>> {
    try {
      const contextHash = payload.strategyOverride
        ? `${payload.strategyOverride}-${payload.theme}-${payload.studentData.grade}-${payload.studentData.profile}-HOMEWORK`
        : `${payload.theme}-${payload.studentData.grade}-${payload.studentData.profile}-HOMEWORK`;

      const semanticContextStr = payload.strategyOverride
        ? `Objetivo: ${payload.objective}. Descrição: ${payload.description}. Estratégia Substituta: ${payload.strategyOverride}. Adaptação: ${payload.studentData.adaptation}. Contexto: Lição de Casa.`
        : `Objetivo: ${payload.objective}. Descrição: ${payload.description}. Adaptação: ${payload.studentData.adaptation}. Contexto: Lição de Casa.`;

      this.logger.log(`Checking semantic cache for Homework...`);
      const payloadEmbedding = await this.geminiProvider.generateEmbeddings(semanticContextStr);

      const cachedMaterial = await this.materialCache.findSimilar(contextHash, payloadEmbedding, 0.95);

      if (cachedMaterial) {
        this.logger.log(`CACHE HIT! Reusing Homework id ${cachedMaterial.id}`);
        return Result.ok<GenerateHomeworkOutput>(cachedMaterial.materialResult);
      }

      this.logger.log(`CACHE MISS. Generating new Homework from scratch...`);

      const systemInstruction = PromptUtil.loadPromptTemplate(__dirname, 'generate-homework.system.md');
      const basePrompt = PromptUtil.loadPromptTemplate(__dirname, 'generate-material.user.md');
      const promptText = PromptUtil.buildPromptContext(basePrompt, payload);

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
