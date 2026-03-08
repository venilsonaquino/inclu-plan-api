import { LessonPlan } from '../entities/lesson-plan.entity';

export abstract class ILessonPlanRepository {
  /**
   * Salva o Agregado LessonPlan por completo (Plano + Adaptações).
   * Em DDD, persistimos o Agregado através de sua Root.
   */
  abstract save(lessonPlan: LessonPlan): Promise<void>;

  /**
   * Persiste múltiplos agregados em lote.
   */
  abstract saveBatch(lessonPlans: LessonPlan[]): Promise<void>;

  abstract findById(id: string): Promise<LessonPlan | null>;

  // For testing purposes
  abstract clear(): Promise<void>;
  abstract count(): Promise<number>;
}
