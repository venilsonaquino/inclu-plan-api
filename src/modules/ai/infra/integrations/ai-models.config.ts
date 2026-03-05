export const AI_MODELS = {
  TEXT: {
    name: 'gemini-2.5-flash',
    pricing: {
      inputPerMillion: 0.075,
      outputPerMillion: 0.3,
    },
  },
  IMAGE: {
    name: 'gemini-3.1-flash-image-preview',
    pricing: {
      perImage: 0.003, // Nano Banana Preview Estimate
    },
  },
  EMBEDDING: {
    name: 'gemini-embedding-001',
    pricing: {
      perMillionTokens: 0, // Virtually free, 1500 RPM on free tier
    },
  },
};

export class AiMetricsUtil {
  static calculateTextCost(inputTokens: number, outputTokens: number): string {
    const costInput =
      (inputTokens * AI_MODELS.TEXT.pricing.inputPerMillion) / 1_000_000;
    const costOutput =
      (outputTokens * AI_MODELS.TEXT.pricing.outputPerMillion) / 1_000_000;
    return (costInput + costOutput).toFixed(6);
  }

  static calculateImageCost(imageCount: number): string {
    return (imageCount * AI_MODELS.IMAGE.pricing.perImage).toFixed(2);
  }
}
