import { ILessonGenerationResponse } from '@/modules/ai/domain/interfaces/lesson-generation-response.interface';

export interface LessonPlanRecord {
  id: string;
  teacherId: string;
  studentId: string;
  discipline: string;
  theme: string;
  lessonResult: ILessonGenerationResponse;
  adaptationDetails: {
    strategy: string;
    behavioral_tips: string;
  };
}

export abstract class ILessonPlanRepository {
  abstract findSimilar(studentHash: string, contentVector: number[], threshold: number): Promise<LessonPlanRecord | null>;
  abstract save(record: LessonPlanRecord): Promise<void>;
  abstract saveBatch(records: LessonPlanRecord[]): Promise<void>;

  // For testing purposes
  abstract clear(): void;
  abstract count(): number;
}
