import { InMemoryGradesRepository } from './in-memory-grades.repository';
import { Grade } from '@/modules/grades/domain/entities/grade.entity';

describe('InMemoryGradesRepository', () => {
  let repository: InMemoryGradesRepository;

  beforeEach(() => {
    repository = new InMemoryGradesRepository();
  });

  it('should create and retrieve a grade', async () => {
    const grade = new Grade({ id: '1', name: '1º Ano' });
    await repository.create(grade);

    const found = await repository.findById('1');
    expect(found).toBeDefined();
    expect(found?.name).toBe('1º Ano');
  });

  it('should return null if grade not found', async () => {
    const found = await repository.findById('non-existent');
    expect(found).toBeNull();
  });

  it('should return all grades', async () => {
    await repository.create(new Grade({ id: '1' }));
    await repository.create(new Grade({ id: '2' }));
    const all = await repository.findAll();
    expect(all.length).toBe(2);
  });
});
