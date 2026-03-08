import { Injectable, Logger, Inject } from '@nestjs/common';
import { IAiProvider } from '@/modules/ai/domain/providers/ai-provider.interface';
import { ITemplateLoader } from '@/modules/ai/domain/providers/template-loader.interface';
import { Result } from '@/shared/domain/utils/result';
import { GenerateBoardInput } from './generate-board.input';
import { GenerateBoardOutput } from './generate-board.output';
import { PromptUtil } from '../../utils/prompt.util';
import { SemanticContext } from '@/modules/ai/domain/value-objects/semantic-context.vo';
import { IMaterialCacheRepository } from '@/modules/ai/domain/repositories/material-cache.repository.interface';
import { randomUUID } from 'node:crypto';

@Injectable()
export class GenerateBoardUseCase {
  private readonly logger = new Logger(GenerateBoardUseCase.name);

  constructor(
    private readonly aiProvider: IAiProvider,
    private readonly templateLoader: ITemplateLoader,
    private readonly materialCache: IMaterialCacheRepository,
  ) { }

  async execute(payload: GenerateBoardInput): Promise<Result<GenerateBoardOutput>> {
    try {
      const semanticContext = new SemanticContext({
        ...payload,
        typeIdentifier: 'BOARD',
        contextDescription: 'Prancha Visual',
      });
      const contextHash = semanticContext.hash;
      const semanticContextStr = semanticContext.semanticString;

      this.logger.log(`Checking semantic cache for Board...`);
      const payloadEmbedding = await this.aiProvider.generateEmbeddings(semanticContextStr);

      const cachedMaterial = await this.materialCache.findSimilar(contextHash, payloadEmbedding, 0.95);

      if (cachedMaterial) {
        this.logger.log(`CACHE HIT! Reusing Board id ${cachedMaterial.id}`);
        return Result.ok<GenerateBoardOutput>(cachedMaterial.materialResult);
      }

      this.logger.log(`CACHE MISS. Generating new Board from scratch...`);

      const systemInstruction = await this.templateLoader.load('generate-board/prompts/generate-board.system.md');
      const basePrompt = await this.templateLoader.load('generate-board/prompts/generate-material.user.md');
      const promptText = PromptUtil.buildPromptContext(basePrompt, payload);

      const rawAiResponse = await this.aiProvider.generateText(systemInstruction, promptText);
      const boardData = rawAiResponse as GenerateBoardOutput;

      if (boardData.board?.imagePrompt) {
        this.logger.log(`Fetching AI Images for Board...`);
        try {
          boardData.board.generatedImage = await this.aiProvider.generateImage(boardData.board.imagePrompt);
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
      return Result.fail<GenerateBoardOutput>(error instanceof Error ? error.message : 'Unknown error');
    }
  }
}
