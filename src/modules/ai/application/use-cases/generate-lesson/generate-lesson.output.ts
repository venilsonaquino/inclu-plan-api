export interface GenerateLessonOutput {
  objective: string;
  bncc: {
    code: string;
    description: string;
  };
  description: string;
  resources: string;
  evaluation: string;
  adaptation: {
    neurodivergencies: string;
    adaptation: string;
  };
  student: {
    id: string;
    name: string;
    grade: string;
    neurodivergencies: string[];
  };
  discipline: {
    name: string;
    theme: string;
  };
  teacherId: string;
}
