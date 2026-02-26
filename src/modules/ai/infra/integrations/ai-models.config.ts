export const AI_MODELS = {
  TEXT: {
    name: 'gemini-2.5-flash',
    pricing: {
      // Prices in USD per 1 million tokens
      inputPerMillion: 0.075,
      outputPerMillion: 0.30,
    },
  },
  IMAGE: {
    name: 'imagen-4.0-generate-001',
    pricing: {
      // Price in USD per 1 generated image
      perImage: 0.03,
    },
  },
};

export class AiMetricsUtil {
  static calculateTextCost(inputTokens: number, outputTokens: number): string {
    const costInput = (inputTokens * AI_MODELS.TEXT.pricing.inputPerMillion) / 1_000_000;
    const costOutput = (outputTokens * AI_MODELS.TEXT.pricing.outputPerMillion) / 1_000_000;
    return (costInput + costOutput).toFixed(6);
  }

  static calculateImageCost(imageCount: number): string {
    return (imageCount * AI_MODELS.IMAGE.pricing.perImage).toFixed(2);
  }
}
