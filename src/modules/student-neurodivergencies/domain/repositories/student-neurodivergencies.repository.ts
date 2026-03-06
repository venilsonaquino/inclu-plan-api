import { StudentNeurodivergency } from '../entities/student-neurodivergency.entity';

export abstract class IStudentNeurodivergenciesRepository {
  abstract assign(association: StudentNeurodivergency): Promise<void>;
  abstract findByStudentId(studentId: string): Promise<StudentNeurodivergency[]>;
  abstract findByNeurodivergencyId(neurodivergencyId: string): Promise<StudentNeurodivergency[]>;
  abstract remove(studentId: string, neurodivergencyId: string): Promise<void>;
}
