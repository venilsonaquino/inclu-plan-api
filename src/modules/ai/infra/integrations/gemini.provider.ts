import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GeminiProvider {
  private readonly logger = new Logger(GeminiProvider.name);
  private readonly baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  private readonly textModelName = 'gemini-2.5-flash';
  private readonly imageModelName = 'imagen-4.0-generate-001';

  private getApiKey(): string {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables.');
    }
    return key;
  }

  async generateText(systemInstruction: string, promptText: string, imagePartBase64?: string): Promise<any> {
    const apiKey = this.getApiKey();
    const url = `${this.baseUrl}/${this.textModelName}:generateContent?key=${apiKey}`;

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

      // Pricing logic for Gemini 1.5 Flash (estimate)
      // Input: $0.075 / 1M tokens -> 0.000000075 per token
      // Output: $0.30 / 1M tokens -> 0.000000300 per token
      const costInput = (promptTokens * 0.075) / 1000000;
      const costOutput = (generatedTokens * 0.30) / 1000000;
      const totalCost = (costInput + costOutput).toFixed(6);

      this.logger.log(
        `[${this.textModelName}] Latency: ${latencyMs}ms | Status: ${finishReason} | Tokens: ${totalTokens} | Est. Cost: $${totalCost} USD`
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
    const url = `${this.baseUrl} / ${this.imageModelName}: predict ? key = ${apiKey}`;

    const requestBody = {
      instances: [{ prompt: imagePrompt }],
      parameters: {
        sampleCount: 1,
        outputOptions: { mimeType: 'image/webp' },
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
        this.logger.warn(`Imagen API failed with status: ${response.status} (Latency: ${latencyMs}ms)`);
        return null; // Do not fail the whole request
      }

      const data = await response.json();

      // Imagen 3 costs ~$0.03 per image
      const cost = (1 * 0.03).toFixed(2);
      this.logger.log(`[${this.imageModelName}] Latency: ${latencyMs}ms | Generated 1 image | Est. Cost: $${cost} USD`);

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
