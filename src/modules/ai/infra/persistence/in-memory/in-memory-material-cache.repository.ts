import { Injectable, Logger } from '@nestjs/common';
import { IMaterialCacheRepository, MaterialCacheRecord } from '@/modules/ai/domain/repositories/material-cache.repository.interface';

@Injectable()
export class InMemoryMaterialCacheRepository implements IMaterialCacheRepository {
  private readonly logger = new Logger(InMemoryMaterialCacheRepository.name);
  private readonly memoryDb: MaterialCacheRecord<any>[] = [];

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
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async findSimilar<T = any>(contextHash: string, payloadVector: number[], threshold: number): Promise<MaterialCacheRecord<T> | null> {
    for (const memory of this.memoryDb) {
      if (memory.contextHash === contextHash) {
        const similarity = this.cosineSimilarity(payloadVector, memory.payloadEmbedding);
        this.logger.debug(`Compared with material cache ${memory.id} - Similarity: ${(similarity * 100).toFixed(2)}%`);

        if (similarity >= threshold) {
          return memory as MaterialCacheRecord<T>;
        }
      }
    }
    return null;
  }

  async save<T = any>(record: MaterialCacheRecord<T>): Promise<void> {
    this.memoryDb.push(record);
  }

  clear(): void {
    this.memoryDb.length = 0;
  }

  count(): number {
    return this.memoryDb.length;
  }
}
