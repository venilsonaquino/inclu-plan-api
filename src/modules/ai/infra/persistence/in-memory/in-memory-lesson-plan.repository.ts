import { Injectable, Logger } from '@nestjs/common';
import {
  ILessonPlanRepository,
  LessonPlanRecord,
} from '@/modules/ai/domain/repositories/lesson-plan.repository.interface';
import { VectorUtil } from '@/shared/utils/vector.util';

@Injectable()
export class InMemoryLessonPlanRepository implements ILessonPlanRepository {
  private readonly logger = new Logger(InMemoryLessonPlanRepository.name);
  private readonly memoryDb: LessonPlanRecord[] = [];

  async findSimilar(
    studentHash: string,
    contentVector: number[],
    threshold: number,
  ): Promise<LessonPlanRecord | null> {
    for (const memory of this.memoryDb) {
      if (memory.studentContextHash === studentHash) {
        const similarity = VectorUtil.cosineSimilarity(
          contentVector,
          memory.contentEmbedding,
        );
        this.logger.debug(
          `Compared with memory ${memory.id} - Similarity: ${(similarity * 100).toFixed(2)}%`,
        );

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
