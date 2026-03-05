import { Injectable, Logger } from '@nestjs/common';
import { IMaterialCacheRepository, MaterialCacheRecord } from '@/modules/ai/domain/repositories/material-cache.repository.interface';
import { VectorUtil } from '@/shared/utils/vector.util';

@Injectable()
export class InMemoryMaterialCacheRepository implements IMaterialCacheRepository {
  private readonly logger = new Logger(InMemoryMaterialCacheRepository.name);
  private readonly memoryDb: MaterialCacheRecord<any>[] = [];

  async findSimilar<T = any>(contextHash: string, payloadVector: number[], threshold: number): Promise<MaterialCacheRecord<T> | null> {
    for (const memory of this.memoryDb) {
      if (memory.contextHash === contextHash) {
        const similarity = VectorUtil.cosineSimilarity(payloadVector, memory.payloadEmbedding);
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
