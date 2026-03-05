import { InMemorySchoolClassesRepository } from './in-memory-school-classes.repository';
import { SchoolClass } from '@/modules/school-classes/domain/entities/school-class.entity';

describe('InMemorySchoolClassesRepository', () => {
  let repository: InMemorySchoolClassesRepository;

  beforeEach(() => {
    repository = new InMemorySchoolClassesRepository();
  });

  it('should create and retrieve by id', async () => {
    const schoolClass = new SchoolClass({
      id: '1',
      name: 'Class',
      teacherId: 't1',
    });
    await repository.create(schoolClass);
    const found = await repository.findById('1');
    expect(found?.name).toBe('Class');
  });

  it('should return null if not found', async () => {
    const found = await repository.findById('non-existent');
    expect(found).toBeNull();
  });

  it('should retrieve by teacherId', async () => {
    await repository.create(new SchoolClass({ id: '1', teacherId: 't1' }));
    await repository.create(new SchoolClass({ id: '2', teacherId: 't1' }));
    await repository.create(new SchoolClass({ id: '3', teacherId: 't2' }));
    const all = await repository.findByTeacherId('t1');
    expect(all.length).toBe(2);
  });
});
