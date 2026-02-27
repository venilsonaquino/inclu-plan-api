export class StudentLearningProfile {
  id: string;
  studentId: string;
  learningProfileId: string;
  notes?: string; // e.g. "needs visual aids to understand math problems"
  createdAt: Date;

  constructor(props: Partial<StudentLearningProfile>) {
    Object.assign(this, props);
  }
}
