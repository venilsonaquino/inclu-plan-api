import { ILessonGenerationResponse } from '@/modules/ai/domain/interfaces/lesson-generation-response.interface';

export interface LessonPlanRecord {
  id: string;
  studentContextHash: string;
  contentEmbedding: number[];
  lessonResult: ILessonGenerationResponse;
}

export const I_LESSON_PLAN_REPOSITORY = 'ILessonPlanRepository';

export interface ILessonPlanRepository {
  findSimilar(studentHash: string, contentVector: number[], threshold: number): Promise<LessonPlanRecord | null>;
  save(record: LessonPlanRecord): Promise<void>;

  // For testing purposes
  clear(): void;
  count(): number;
}
