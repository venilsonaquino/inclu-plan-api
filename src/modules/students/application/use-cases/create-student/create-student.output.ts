export class CreateStudentOutput {
  id: string;
  name: string;
  grade: string;
  profiles: string[];
  schoolClassId?: string;
  createdAt: Date;
}
