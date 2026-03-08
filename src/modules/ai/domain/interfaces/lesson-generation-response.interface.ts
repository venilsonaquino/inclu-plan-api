export interface ILessonGenerationResponse {
  lesson_number: number;
  objective: string;
  learning_objects: string;
  bncc: {
    code: string;
    description: string;
  };
  duration: string;
  activity_steps: string[];
  udl_strategies: {
    representation: string;
    action_and_expression: string;
    engagement: string;
  };
  resources: string;
  evaluation: string;
  adaptations: Array<{
    student_name: string;
    student_grade: string;
    student_neurodivergencies: string;
    strategy: string;
    behavioral_tips: string;
    support_level: string;
    success_indicators: string;
  }>;
}

export interface IDisciplinaGenerationResponse {
  name: string;
  lesson_title: string;
  estimated_prep_time: string;
  lessons: ILessonGenerationResponse[];
}

export interface ILessonGenerationBatchResponse {
  disciplines: IDisciplinaGenerationResponse[];
}
