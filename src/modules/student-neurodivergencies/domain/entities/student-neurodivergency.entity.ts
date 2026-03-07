export class StudentNeurodivergency {
  id: string;
  studentId: string;
  neurodivergencyId: string;
  notes?: string;
  createdAt: Date;

  constructor(props: Partial<StudentNeurodivergency>) {
    Object.assign(this, props);
  }
}
