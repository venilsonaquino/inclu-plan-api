import { AiMetricsUtil, AI_MODELS } from './ai-models.config';

describe('AiMetricsUtil', () => {
  describe('calculateTextCost', () => {
    it('should correctly calculate the cost for input and output tokens', () => {
      // Input: 1,000,000 tokens => $0.075
      // Output: 1,000,000 tokens => $0.30
      // Total: $0.375
      const result = AiMetricsUtil.calculateTextCost(1000000, 1000000);
      expect(result).toBe('0.375000');
    });

    it('should handle zero tokens', () => {
      const result = AiMetricsUtil.calculateTextCost(0, 0);
      expect(result).toBe('0.000000');
    });

    it('should correctly calculate the cost for small token amounts', () => {
      // Input: 10,000 tokens => $0.00075
      // Output: 5,000 tokens => $0.0015
      // Total: $0.002250
      const result = AiMetricsUtil.calculateTextCost(10000, 5000);
      expect(result).toBe('0.002250');
    });
  });

  describe('calculateImageCost', () => {
    it('should correctly calculate the cost for a valid image count', () => {
      // 1 image => 0.003
      let result = AiMetricsUtil.calculateImageCost(1);
      expect(result).toBe('0.00');

      // 5 images => 0.015 (Rounds up to 0.02)
      result = AiMetricsUtil.calculateImageCost(5);
      expect(result).toBe('0.02');

      // 100 images => 0.30
      result = AiMetricsUtil.calculateImageCost(100);
      expect(result).toBe('0.30');
    });

    it('should handle zero images', () => {
      const result = AiMetricsUtil.calculateImageCost(0);
      expect(result).toBe('0.00');
    });
  });

  describe('AI_MODELS Const', () => {
    it('should export the expected TEXT and IMAGE properties', () => {
      expect(AI_MODELS).toBeDefined();
      expect(AI_MODELS.TEXT.name).toBe('gemini-2.5-flash');
      expect(AI_MODELS.TEXT.pricing.inputPerMillion).toBe(0.075);
      expect(AI_MODELS.TEXT.pricing.outputPerMillion).toBe(0.30);

      expect(AI_MODELS.IMAGE.name).toBe('gemini-3.1-flash-image');
      expect(AI_MODELS.IMAGE.pricing.perImage).toBe(0.003);
    });
  });
});
