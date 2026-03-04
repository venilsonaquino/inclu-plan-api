import { z } from 'zod';

export const GenerateLessonSchema = z.object({
  days: z.array(z.object({
    day: z.string().describe("Nome do dia (ex: Segunda-feira)"),
    subjects: z.array(z.object({
      name: z.string().describe("Nome da disciplina"),
      activities: z.array(z.object({
        objective: z.string(),
        bncc: z.object({
          code: z.string(),
          description: z.string()
        }),
        description: z.string(),
        resources: z.string(),
        evaluation: z.string(),
        adaptations: z.array(z.object({
          student: z.string(),
          profile: z.string(),
          adaptation: z.string()
        }))
      }))
    }))
  }))
});

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
