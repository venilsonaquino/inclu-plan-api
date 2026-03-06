import { StudentLearningProfile } from '../entities/student-learning-profile.entity';

export abstract class IStudentLearningProfilesRepository {
  abstract assign(profileAssociation: StudentLearningProfile): Promise<void>;
  abstract findByStudentId(studentId: string): Promise<StudentLearningProfile[]>;
  abstract findByProfileId(learningProfileId: string): Promise<StudentLearningProfile[]>;
  abstract remove(studentId: string, learningProfileId: string): Promise<void>;
}
