import { InMemoryStudentLearningProfilesRepository } from './in-memory-student-learning-profiles.repository';
import { StudentLearningProfile } from '@/modules/student-learning-profiles/domain/entities/student-learning-profile.entity';

describe('InMemoryStudentLearningProfilesRepository', () => {
  let repository: InMemoryStudentLearningProfilesRepository;

  beforeEach(() => {
    repository = new InMemoryStudentLearningProfilesRepository();
  });

  it('should assign and retrieve by studentId or profileId', async () => {
    const assoc = new StudentLearningProfile({ id: '1', studentId: 's1', learningProfileId: 'p1' });
    await repository.assign(assoc);

    const byStudent = await repository.findByStudentId('s1');
    expect(byStudent.length).toBe(1);

    const byProfile = await repository.findByProfileId('p1');
    expect(byProfile.length).toBe(1);
  });

  it('should remove connection', async () => {
    const assoc = new StudentLearningProfile({ id: '1', studentId: 's1', learningProfileId: 'p1' });
    await repository.assign(assoc);
    await repository.remove('s1', 'p1');

    const byStudent = await repository.findByStudentId('s1');
    expect(byStudent.length).toBe(0);
  });
});
