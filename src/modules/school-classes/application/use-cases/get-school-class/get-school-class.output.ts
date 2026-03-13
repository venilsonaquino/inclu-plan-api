export type GetSchoolClassOutput = {
  id: string;
  name: string;
  isActive: boolean;
  students: {
    id: string;
    name: string;
    gradeId: string;
    isActive: boolean;
    neurodivergencies: {
      id: string;
      name: string;
    }[];
  }[];
  createdAt: string;
};
