export interface RawAiLesson {
  objective: string;
  bncc: {
    code: string;
    description: string;
  };
  duration: string;
  activity_steps: string;
  udl_strategies: {
    representation: string;
    action_and_expression: string;
    engagement: string;
  };
  resources: string;
  evaluation: string;
  adaptations: Array<{
    student_neurodivergencies: string;
    strategy: string;
    behavioral_tips: string;
  }>;
}

export interface RawAiBatchResponse {
  lessons: RawAiLesson[];
}
