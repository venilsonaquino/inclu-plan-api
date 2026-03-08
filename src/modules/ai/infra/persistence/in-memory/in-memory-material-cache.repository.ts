import { IMaterialCacheRepository, MaterialCacheEntry } from '@/modules/ai/domain/repositories/material-cache.repository.interface';

export class InMemoryMaterialCacheRepository implements IMaterialCacheRepository {
  private cache: MaterialCacheEntry[] = [];

  async save(entry: MaterialCacheEntry): Promise<void> {
    this.cache.push({
      ...entry,
      createdAt: new Date(),
    });
  }

  async findSimilar(
    contextHash: string,
    embedding: number[],
    threshold: number,
  ): Promise<MaterialCacheEntry | null> {
    // Filtra pelo mesmo hash de contexto primeiro (mais rápido)
    const candidates = this.cache.filter((item) => item.contextHash === contextHash);

    for (const item of candidates) {
      const similarity = this.cosineSimilarity(embedding, item.payloadEmbedding);
      if (similarity >= threshold) {
        return item;
      }
    }

    return null;
  }

  async clear(): Promise<void> {
    this.cache = [];
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    if (magnitude === 0) return 0;

    return dotProduct / magnitude;
  }
}
