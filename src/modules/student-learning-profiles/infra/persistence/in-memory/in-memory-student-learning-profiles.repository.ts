import { Injectable } from '@nestjs/common';
import { IStudentLearningProfilesRepository } from '@/modules/student-learning-profiles/domain/repositories/student-learning-profiles.repository';
import { StudentLearningProfile } from '@/modules/student-learning-profiles/domain/entities/student-learning-profile.entity';

@Injectable()
export class InMemoryStudentLearningProfilesRepository implements IStudentLearningProfilesRepository {
  private associations: StudentLearningProfile[] = [];

  async assign(profileAssociation: StudentLearningProfile): Promise<void> {
    this.associations.push(profileAssociation);
  }

  async findByStudentId(studentId: string): Promise<StudentLearningProfile[]> {
    return this.associations.filter(a => a.studentId === studentId);
  }

  async findByProfileId(learningProfileId: string): Promise<StudentLearningProfile[]> {
    return this.associations.filter(a => a.learningProfileId === learningProfileId);
  }

  async remove(studentId: string, learningProfileId: string): Promise<void> {
    this.associations = this.associations.filter(
      a => !(a.studentId === studentId && a.learningProfileId === learningProfileId),
    );
  }
}
