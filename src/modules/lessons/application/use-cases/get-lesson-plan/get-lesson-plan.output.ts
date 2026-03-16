export interface StudentAdaptationOutput {
  id: string;
  studentId: string;
  studentName?: string;
  studentGrade?: string;
  studentNeurodivergencies?: string;
  strategy: string;
  behavioralTips: string;
  supportLevel: string;
  successIndicators: string;
}

export interface GetLessonPlanOutput {
  id: string;
  teacherId: string;
  discipline: string;
  theme: string;
  lessonTitle: string;
  estimatedPrepTime?: string;
  lessonNumber?: number;
  objective?: string;
  learningObjects?: string;
  bnccCode?: string;
  bnccDescription?: string;
  duration?: string;
  activitySteps?: string[];
  udlRepresentation?: string;
  udlActionExpression?: string;
  udlEngagement?: string;
  resources?: string;
  evaluation?: string;
  adaptations: StudentAdaptationOutput[];
  createdAt: Date;
  updatedAt: Date;
}
