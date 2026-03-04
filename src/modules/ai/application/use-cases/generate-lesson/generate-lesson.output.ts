export interface GenerateLessonOutput {
  days: Array<{
    day: string;
    subjects: Array<{
      name: string;
      activities: Array<{
        objective: string;
        bncc: {
          code: string;
          description: string;
        };
        description: string;
        resources: string;
        evaluation: string;
        adaptations: Array<{
          student: string;
          profile: string;
          adaptation: string;
        }>;
      }>;
    }>;
  }>;
}
