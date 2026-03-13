export type ListSchoolClassesByTeacherOutput = {
  id: string;
  name: string;
  isActive: boolean;
  students: {
    id: string;
    name: string;
    gradeId: string;
    isActive: boolean;
  }[];
  createdAt: string;
}[];
