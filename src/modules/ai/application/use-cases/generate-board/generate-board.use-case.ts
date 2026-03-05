import { Injectable, Logger, Inject } from '@nestjs/common';
import { GeminiProvider } from '@/modules/ai/infra/integrations/gemini.provider';
import { Result } from '@/shared/domain/utils/result';
import { GenerateBoardInput } from './generate-board.input';
import { GenerateBoardOutput } from './generate-board.output';
import { PromptUtil } from '../../utils/prompt.util';
import {
  I_MATERIAL_CACHE_REPOSITORY,
  IMaterialCacheRepository,
} from '@/modules/ai/domain/repositories/material-cache.repository.interface';
import { randomUUID } from 'node:crypto';

@Injectable()
export class GenerateBoardUseCase {
  private readonly logger = new Logger(GenerateBoardUseCase.name);

  constructor(
    private readonly geminiProvider: GeminiProvider,
    @Inject(I_MATERIAL_CACHE_REPOSITORY)
    private readonly materialCache: IMaterialCacheRepository,
  ) {}

  async execute(
    payload: GenerateBoardInput,
  ): Promise<Result<GenerateBoardOutput>> {
    try {
      const contextHash = payload.strategyOverride
        ? `${payload.strategyOverride}-${payload.theme}-${payload.studentData.grade}-${payload.studentData.profile}-BOARD`
        : `${payload.theme}-${payload.studentData.grade}-${payload.studentData.profile}-BOARD`;

      const semanticContextStr = payload.strategyOverride
        ? `Objetivo: ${payload.objective}. Descrição: ${payload.description}. Estratégia Substituta: ${payload.strategyOverride}. Adaptação: ${payload.studentData.adaptation}. Contexto: Prancha Visual.`
        : `Objetivo: ${payload.objective}. Descrição: ${payload.description}. Adaptação: ${payload.studentData.adaptation}. Contexto: Prancha Visual.`;

      this.logger.log(`Checking semantic cache for Board...`);
      const payloadEmbedding =
        await this.geminiProvider.generateEmbeddings(semanticContextStr);

      const cachedMaterial = await this.materialCache.findSimilar(
        contextHash,
        payloadEmbedding,
        0.95,
      );

      if (cachedMaterial) {
        this.logger.log(`CACHE HIT! Reusing Board id ${cachedMaterial.id}`);
        return Result.ok<GenerateBoardOutput>(cachedMaterial.materialResult);
      }

      this.logger.log(`CACHE MISS. Generating new Board from scratch...`);

      const systemInstruction = PromptUtil.loadPromptTemplate(
        __dirname,
        'generate-board.system.md',
      );
      const basePrompt = PromptUtil.loadPromptTemplate(
        __dirname,
        'generate-material.user.md',
      );
      const promptText = PromptUtil.buildPromptContext(basePrompt, payload);

      const rawAiResponse = await this.geminiProvider.generateText(
        systemInstruction,
        promptText,
      );
      const boardData = rawAiResponse as GenerateBoardOutput;

      if (boardData.board?.imagePrompt) {
        this.logger.log(`Fetching AI Images for Board...`);
        try {
          boardData.board.generatedImage =
            await this.geminiProvider.generateImage(
              boardData.board.imagePrompt,
            );
        } catch (e) {
          this.logger.warn(`Board image failed: ${e.message}`);
        }
      }

      await this.materialCache.save({
        id: randomUUID(),
        contextHash,
        payloadEmbedding,
        materialResult: boardData,
      });

      return Result.ok<GenerateBoardOutput>(boardData);
    } catch (error) {
      this.logger.error('Failed to generate board', error);
      return Result.fail<GenerateBoardOutput>(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }
}
