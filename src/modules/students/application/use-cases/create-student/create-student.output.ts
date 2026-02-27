export class CreateStudentOutput {
  id: string;
  name: string;
  gradeId: string;
  profiles: string[];
  schoolClassId?: string;
  createdAt: Date;
}
