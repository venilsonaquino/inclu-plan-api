export class CreateStudentOutput {
  id: string;
  name: string;
  gradeId: string;
  neurodivergencies: string[];
  schoolClassId?: string;
  createdAt: Date;
}
