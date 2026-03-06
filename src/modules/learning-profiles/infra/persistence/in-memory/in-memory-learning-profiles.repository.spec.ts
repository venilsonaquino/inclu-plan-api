import { InMemoryLearningProfilesRepository } from './in-memory-learning-profiles.repository';
import { LearningProfile } from '@/modules/learning-profiles/domain/entities/learning-profile.entity';

describe('InMemoryLearningProfilesRepository', () => {
  let repository: InMemoryLearningProfilesRepository;

  beforeEach(() => {
    repository = new InMemoryLearningProfilesRepository();
  });

  it('should create and retrieve', async () => {
    const profile = new LearningProfile({
      id: '1',
      name: 'TEA',
      description: 'desc',
    });
    await repository.create(profile);
    const found = await repository.findById('1');
    expect(found?.name).toBe('TEA');
  });

  it('should return null if not found', async () => {
    const found = await repository.findById('non-existent');
    expect(found).toBeNull();
  });

  it('should return all', async () => {
    await repository.create(new LearningProfile({ id: '1' }));
    await repository.create(new LearningProfile({ id: '2' }));
    const all = await repository.findAll();
    expect(all.length).toBe(2);
  });
});
