import { Injectable, Logger } from '@nestjs/common';
import { AI_MODELS, AiMetricsUtil } from './ai-models.config';

@Injectable()
export class GeminiProvider {
  private readonly logger = new Logger(GeminiProvider.name);
  private readonly baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';

  private getApiKey(): string {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables.');
    }
    return key;
  }

  async generateText(systemInstruction: string, promptText: string, imagePartBase64?: string): Promise<any> {
    const apiKey = this.getApiKey();
    const url = `${this.baseUrl}/${AI_MODELS.TEXT.name}:generateContent?key=${apiKey}`;

    const contentsPart: any[] = [{ text: promptText }];
    if (imagePartBase64) {
      contentsPart.unshift({
        inlineData: {
          mimeType: 'image/jpeg',
          data: imagePartBase64,
        }
      });
    }

    const requestBody = {
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: [{ parts: contentsPart }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    };

    try {
      const startTime = performance.now();
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const latencyMs = Math.round(performance.now() - startTime);

      const candidate = data.candidates?.[0];
      const rawText = candidate?.content?.parts?.[0]?.text;
      const finishReason = candidate?.finishReason || 'UNKNOWN';

      const usage = data.usageMetadata || {};
      const promptTokens = usage.promptTokenCount || 0;
      const generatedTokens = usage.candidatesTokenCount || 0;
      const totalTokens = usage.totalTokenCount || 0;

      // Pricing logic moved to AiMetricsUtil to respect Clean Code
      const totalCost = AiMetricsUtil.calculateTextCost(promptTokens, generatedTokens);

      this.logger.log(
        `[${AI_MODELS.TEXT.name}] Latency: ${latencyMs}ms | Status: ${finishReason} | Tokens: ${totalTokens} | Est. Cost: $${totalCost} USD`
      );

      if (!rawText) {
        throw new Error(`AI generation failed or was blocked. Reason: ${finishReason}`);
      }

      return JSON.parse(rawText);
    } catch (error) {
      this.logger.error('Error in generateText', error);
      throw error;
    }
  }

  async generateImage(imagePrompt: string): Promise<string | null> {
    const apiKey = this.getApiKey();
    const url = `${this.baseUrl}/${AI_MODELS.IMAGE.name}:predict?key=${apiKey}`;

    const requestBody = {
      instances: [{ prompt: imagePrompt }],
      parameters: {
        sampleCount: 1,
        outputOptions: { mimeType: 'image/jpeg' },
      },
    };

    try {
      const startTime = performance.now();
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const latencyMs = Math.round(performance.now() - startTime);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        this.logger.warn(
          `[${AI_MODELS.IMAGE.name}] Imagen API failed with status: ${response.status} (Latency: ${latencyMs}ms)`
        );
        this.logger.error(`[${AI_MODELS.IMAGE.name}] Details: ${JSON.stringify(errorData)}`);
        return null;
      }

      const data = await response.json();

      // Pricing logic moved to AiMetricsUtil
      const cost = AiMetricsUtil.calculateImageCost(1);
      this.logger.log(`[${AI_MODELS.IMAGE.name}] Latency: ${latencyMs}ms | Generated 1 image | Est. Cost: $${cost} USD`);

      if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
        return data.predictions[0].bytesBase64Encoded;
      }
      return null;
    } catch (error) {
      this.logger.error('Error generating image', error);
      return null;
    }
  }
}
