import { Injectable, Logger, Inject } from '@nestjs/common';
import { GeminiProvider } from '@/modules/ai/infra/integrations/gemini.provider';
import { Result } from '@/shared/domain/utils/result';
import { GenerateMaterialInput } from '../generate-material/generate-material.input';
import { GenerateCardsOutput } from './generate-cards.output';
import * as fs from 'fs';
import * as path from 'path';
import { I_MATERIAL_CACHE_REPOSITORY, IMaterialCacheRepository } from '@/modules/ai/domain/repositories/material-cache.repository.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class GenerateCardsUseCase {
  private readonly logger = new Logger(GenerateCardsUseCase.name);

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

  private async fetchImagesForCards(cardsData: GenerateCardsOutput): Promise<void> {
    if (!cardsData || !Array.isArray(cardsData.cards)) return;

    const promises = cardsData.cards
      .filter(card => card.imagePrompt)
      .map(card =>
        this.geminiProvider.generateImage(card.imagePrompt)
          .then(base64 => { card.generatedImage = base64; })
          .catch(e => { this.logger.warn(`Card image failed: ${e.message}`); })
      );

    await Promise.all(promises);
  }

  async execute(payload: GenerateMaterialInput): Promise<Result<GenerateCardsOutput>> {
    try {
      const contextHash = payload.strategyOverride
        ? `${payload.strategyOverride}-${payload.theme}-${payload.studentData.grade}-${payload.studentData.profile}-CARDS`
        : `${payload.theme}-${payload.studentData.grade}-${payload.studentData.profile}-CARDS`;

      const semanticContextStr = payload.strategyOverride
        ? `Objetivo: ${payload.objective}. Descrição: ${payload.description}. Estratégia Substituta: ${payload.strategyOverride}. Adaptação: ${payload.studentData.adaptation}. Contexto: Cartões Visuais.`
        : `Objetivo: ${payload.objective}. Descrição: ${payload.description}. Adaptação: ${payload.studentData.adaptation}. Contexto: Cartões Visuais.`;

      this.logger.log(`Checking semantic cache for Cards...`);
      const payloadEmbedding = await this.geminiProvider.generateEmbeddings(semanticContextStr);

      const cachedMaterial = await this.materialCache.findSimilar(contextHash, payloadEmbedding, 0.95);

      if (cachedMaterial) {
        this.logger.log(`CACHE HIT! Reusing Cards id ${cachedMaterial.id}`);
        return Result.ok<GenerateCardsOutput>(cachedMaterial.materialResult);
      }

      this.logger.log(`CACHE MISS. Generating new Cards from scratch...`);

      const systemInstruction = this.loadPromptTemplate('generate-cards.system.md');
      const basePrompt = this.loadPromptTemplate('generate-material.user.md');
      const promptText = this.buildPromptContext(basePrompt, payload);

      const rawAiResponse = await this.geminiProvider.generateText(systemInstruction, promptText);

      const cardsData = rawAiResponse as GenerateCardsOutput;

      // Full generation (Text + Images)
      this.logger.log(`Fetching AI Images for Cards...`);
      await this.fetchImagesForCards(cardsData);

      await this.materialCache.save({
        id: randomUUID(),
        contextHash,
        payloadEmbedding,
        materialResult: cardsData
      });

      return Result.ok<GenerateCardsOutput>(cardsData);
    } catch (error) {
      this.logger.error('Failed to generate cards', error);
      return Result.fail<GenerateCardsOutput>(error instanceof Error ? error.message : 'Unknown error');
    }
  }
}
