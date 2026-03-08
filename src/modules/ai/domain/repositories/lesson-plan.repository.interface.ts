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

export const I_LESSON_PLAN_REPOSITORY = 'ILessonPlanRepository';

export interface ILessonPlanRepository {
  findSimilar(studentHash: string, contentVector: number[], threshold: number): Promise<LessonPlanRecord | null>;
  save(record: LessonPlanRecord): Promise<void>;
  saveBatch(records: LessonPlanRecord[]): Promise<void>;

  // For testing purposes
  clear(): void;
  count(): number;
}
