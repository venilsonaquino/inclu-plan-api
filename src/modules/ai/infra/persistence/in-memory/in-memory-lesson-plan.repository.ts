import { Injectable, Logger } from '@nestjs/common';
import { ILessonPlanRepository, LessonPlanRecord } from '@/modules/ai/domain/repositories/lesson-plan.repository.interface';

@Injectable()
export class InMemoryLessonPlanRepository implements ILessonPlanRepository {
  private readonly logger = new Logger(InMemoryLessonPlanRepository.name);
  private readonly memoryDb: LessonPlanRecord[] = [];

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

  async findSimilar(studentHash: string, contentVector: number[], threshold: number): Promise<LessonPlanRecord | null> {
    for (const memory of this.memoryDb) {
      if (memory.studentContextHash === studentHash) {
        const similarity = this.cosineSimilarity(contentVector, memory.contentEmbedding);
        this.logger.debug(`Compared with memory ${memory.id} - Similarity: ${(similarity * 100).toFixed(2)}%`);

        if (similarity >= threshold) {
          return memory;
        }
      }
    }
    return null;
  }

  async save(record: LessonPlanRecord): Promise<void> {
    this.memoryDb.push(record);
  }

  clear(): void {
    this.memoryDb.length = 0;
  }

  count(): number {
    return this.memoryDb.length;
  }
}
