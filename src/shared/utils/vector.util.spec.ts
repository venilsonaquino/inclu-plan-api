import { VectorUtil } from './vector.util';

describe('VectorUtil', () => {
  describe('cosineSimilarity', () => {
    it('should return 0 if vectors have different lengths', () => {
      const vecA = [1, 2, 3];
      const vecB = [1, 2];
      expect(VectorUtil.cosineSimilarity(vecA, vecB)).toBe(0);
    });

    it('should calculate correct cosine similarity for identical vectors', () => {
      const vecA = [1, 1, 1];
      const vecB = [1, 1, 1];
      expect(VectorUtil.cosineSimilarity(vecA, vecB)).toBeCloseTo(1, 4);
    });

    it('should calculate correct cosine similarity for orthogonal vectors', () => {
      const vecA = [1, 0];
      const vecB = [0, 1];
      expect(VectorUtil.cosineSimilarity(vecA, vecB)).toBe(0);
    });

    it('should calculate correct cosine similarity for opposite vectors', () => {
      const vecA = [1, 1];
      const vecB = [-1, -1];
      expect(VectorUtil.cosineSimilarity(vecA, vecB)).toBeCloseTo(-1, 4);
    });

    it('should calculate correct cosine similarity for arbitrary vectors', () => {
      const vecA = [1, 2, 3];
      const vecB = [4, 5, 6];
      // Dot product: 1*4 + 2*5 + 3*6 = 4 + 10 + 18 = 32
      // Norm A: sqrt(1+4+9) = sqrt(14) ~ 3.7416...
      // Norm B: sqrt(16+25+36) = sqrt(77) ~ 8.7749...
      // Sim = 32 / (sqrt(14) * sqrt(77)) = 32 / 32.8329 = 0.974631846
      expect(VectorUtil.cosineSimilarity(vecA, vecB)).toBeCloseTo(
        0.974631846,
        4,
      );
    });

    it('should return 0 if norm of vector A is 0', () => {
      const vecA = [0, 0, 0];
      const vecB = [1, 2, 3];
      expect(VectorUtil.cosineSimilarity(vecA, vecB)).toBe(0);
    });

    it('should return 0 if norm of vector B is 0', () => {
      const vecA = [1, 2, 3];
      const vecB = [0, 0, 0];
      expect(VectorUtil.cosineSimilarity(vecA, vecB)).toBe(0);
    });
  });
});
