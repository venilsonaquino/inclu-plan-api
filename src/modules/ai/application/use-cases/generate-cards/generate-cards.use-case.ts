import { Injectable, Logger, Inject } from '@nestjs/common';
import { I_AI_PROVIDER, IAiProvider } from '@/modules/ai/domain/providers/ai-provider.interface';
import { I_TEMPLATE_LOADER, ITemplateLoader } from '@/modules/ai/domain/providers/template-loader.interface';
import { Result } from '@/shared/domain/utils/result';
import { GenerateCardsInput } from './generate-cards.input';
import { GenerateCardsOutput } from './generate-cards.output';
import { PromptUtil } from '../../utils/prompt.util';
import { SemanticContext } from '@/modules/ai/domain/value-objects/semantic-context.vo';
import {
  I_MATERIAL_CACHE_REPOSITORY,
  IMaterialCacheRepository,
} from '@/modules/ai/domain/repositories/material-cache.repository.interface';
import { randomUUID } from 'node:crypto';

@Injectable()
export class GenerateCardsUseCase {
  private readonly logger = new Logger(GenerateCardsUseCase.name);

  constructor(
    @Inject(I_AI_PROVIDER)
    private readonly aiProvider: IAiProvider,
    @Inject(I_TEMPLATE_LOADER)
    private readonly templateLoader: ITemplateLoader,
    @Inject(I_MATERIAL_CACHE_REPOSITORY)
    private readonly materialCache: IMaterialCacheRepository,
  ) {}

  private async fetchImagesForCards(cardsData: GenerateCardsOutput): Promise<void> {
    if (!cardsData || !Array.isArray(cardsData.cards)) return;

    const promises = cardsData.cards
      .filter(card => card.imagePrompt)
      .map(card =>
        this.aiProvider
          .generateImage(card.imagePrompt)
          .then(base64 => {
            card.generatedImage = base64;
          })
          .catch(e => {
            this.logger.warn(`Card image failed: ${e.message}`);
          }),
      );

    await Promise.all(promises);
  }

  async execute(payload: GenerateCardsInput): Promise<Result<GenerateCardsOutput>> {
    try {
      const semanticContext = new SemanticContext({
        ...payload,
        typeIdentifier: 'CARDS',
        contextDescription: 'Cartões Visuais',
      });
      const contextHash = semanticContext.hash;
      const semanticContextStr = semanticContext.semanticString;

      this.logger.log(`Checking semantic cache for Cards...`);
      const payloadEmbedding = await this.aiProvider.generateEmbeddings(semanticContextStr);

      const cachedMaterial = await this.materialCache.findSimilar(contextHash, payloadEmbedding, 0.95);

      if (cachedMaterial) {
        this.logger.log(`CACHE HIT! Reusing Cards id ${cachedMaterial.id}`);
        return Result.ok<GenerateCardsOutput>(cachedMaterial.materialResult);
      }

      this.logger.log(`CACHE MISS. Generating new Cards from scratch...`);

      const systemInstruction = await this.templateLoader.load('generate-cards/prompts/generate-cards.system.md');
      const basePrompt = await this.templateLoader.load('generate-cards/prompts/generate-material.user.md');
      const promptText = PromptUtil.buildPromptContext(basePrompt, payload);

      const rawAiResponse = await this.aiProvider.generateText(systemInstruction, promptText);

      const cardsData = rawAiResponse as GenerateCardsOutput;

      // Full generation (Text + Images)
      this.logger.log(`Fetching AI Images for Cards...`);
      await this.fetchImagesForCards(cardsData);

      await this.materialCache.save({
        id: randomUUID(),
        contextHash,
        payloadEmbedding,
        materialResult: cardsData,
      });

      return Result.ok<GenerateCardsOutput>(cardsData);
    } catch (error) {
      this.logger.error('Failed to generate cards', error);
      return Result.fail<GenerateCardsOutput>(error instanceof Error ? error.message : 'Unknown error');
    }
  }
}
