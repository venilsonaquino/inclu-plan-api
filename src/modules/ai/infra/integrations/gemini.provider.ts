import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { AI_MODELS, AiMetricsUtil } from './ai-models.config';
import { GoogleGenAI } from '@google/genai'; // Keep just in case, but unused hereafter.
import { zodToJsonSchema } from 'zod-to-json-schema';

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

  async generateText(systemInstruction: string, promptText: string, schema?: any, imagePartBase64?: string): Promise<any> {
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

    const generationConfig: any = {
      responseMimeType: 'application/json',
      temperature: 0.7,
    };

    if (schema) {
      generationConfig.responseSchema = zodToJsonSchema(schema);
    }

    const requestBody = {
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: [{ parts: contentsPart }],
      generationConfig,
    };

    try {
      const startTime = performance.now();
      const response = await axios.post(url, requestBody, {
        headers: { 'Content-Type': 'application/json' },
      });

      const latencyMs = Math.round(performance.now() - startTime);
      const data = response.data;

      const candidate = data.candidates?.[0];
      const rawText = candidate?.content?.parts?.[0]?.text;
      const finishReason = candidate?.finishReason || 'UNKNOWN';

      const usage = data.usageMetadata || {};
      const promptTokens = usage.promptTokenCount || 0;
      const generatedTokens = usage.candidatesTokenCount || 0;
      const totalTokens = usage.totalTokenCount || 0;

      const totalCost = AiMetricsUtil.calculateTextCost(promptTokens, generatedTokens);

      this.logger.log(
        `[${AI_MODELS.TEXT.name}] Latency: ${latencyMs}ms | Status: ${finishReason} | Tokens: ${totalTokens} | Est. Cost: $${totalCost} USD`
      );

      if (!rawText) {
        throw new Error(`AI generation failed or was blocked. Reason: ${finishReason}`);
      }

      if (schema) {
        return JSON.parse(rawText);
      }
      return rawText;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        this.logger.error(`Gemini API error: ${error.response.status}`, error.response.data);
        throw new Error(error.response.data?.error?.message || `Gemini API error: ${error.response.status}`);
      }
      this.logger.error('Error in generateText via Axios', error);
      throw error;
    }
  }

  async generateImage(imagePrompt: string): Promise<string | null> {
    const apiKey = this.getApiKey();
    // A API do Flash (Nano Banana) usa o padrão generateContent como texto
    const url = `${this.baseUrl}/${AI_MODELS.IMAGE.name}:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{ parts: [{ text: imagePrompt }] }]
    };

    const startTime = performance.now();

    try {
      const response = await axios.post(url, requestBody, {
        headers: { 'Content-Type': 'application/json' },
      });

      const latencyMs = Math.round(performance.now() - startTime);
      const data = response.data;

      // Pricing logic moved to AiMetricsUtil
      const cost = AiMetricsUtil.calculateImageCost(1);
      this.logger.log(`[${AI_MODELS.IMAGE.name}] Latency: ${latencyMs}ms | Generated 1 image | Est. Cost: $${cost} USD`);

      // O Nano Banana devolve a imagem no corpo de parts -> inlineData -> data (base64)
      const candidateParts = data.candidates?.[0]?.content?.parts || [];
      for (const part of candidateParts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data; // Retorna o Base64 nativo
        }
      }
      return null;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        this.logger.warn(
          `[${AI_MODELS.IMAGE.name}] API failed with status: ${error.response.status} (Latency: ${Math.round(performance.now() - startTime)}ms)}`
        );
        this.logger.error(`[${AI_MODELS.IMAGE.name}] Details: ${JSON.stringify(error.response.data)}`);
      } else {
        this.logger.error('Error generating image', error);
      }
    }
    return null;
  }

  async generateEmbeddings(text: string): Promise<number[]> {
    const apiKey = this.getApiKey();
    const url = `${this.baseUrl}/${AI_MODELS.EMBEDDING.name}:embedContent?key=${apiKey}`;

    const requestBody = {
      model: `models/${AI_MODELS.EMBEDDING.name}`,
      content: {
        parts: [{ text }]
      }
    };

    try {
      const startTime = performance.now();
      const response = await axios.post(url, requestBody, {
        headers: { 'Content-Type': 'application/json' },
      });

      const latencyMs = Math.round(performance.now() - startTime);
      const data = response.data;

      const embeddingArray = data.embedding?.values;

      if (!embeddingArray || !Array.isArray(embeddingArray)) {
        throw new Error('Failed to extract embedding array from Google AI response.');
      }

      this.logger.log(`[${AI_MODELS.EMBEDDING.name}] Latency: ${latencyMs}ms | Generated Vector[${embeddingArray.length}]`);

      return embeddingArray;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        this.logger.error(`Embedding API error: ${error.response.status}`, error.response.data);
        throw new Error(error.response.data?.error?.message || `Embedding API error: ${error.response.status}`);
      }
      this.logger.error('Error in generateEmbeddings', error);
      throw error;
    }
  }
}
