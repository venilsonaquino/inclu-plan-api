import { InMemoryStudentsRepository } from './in-memory-students.repository';
import { Student } from '@/modules/students/domain/entities/student.entity';

describe('InMemoryStudentsRepository', () => {
  let repository: InMemoryStudentsRepository;

  beforeEach(() => {
    repository = new InMemoryStudentsRepository();
  });

  it('should create and retrieve by id', async () => {
    const student = new Student({
      id: '1',
      name: 'John',
      gradeId: 'g1',
      profiles: [],
    });
    await repository.create(student);
    const found = await repository.findById('1');
    expect(found?.name).toBe('John');
  });

  it('should return null if not found', async () => {
    const found = await repository.findById('non-existent');
    expect(found).toBeNull();
  });

  it('should retrieve by classId', async () => {
    await repository.create(
      new Student({
        id: '1',
        schoolClassId: 'c1',
        name: 'A',
        gradeId: '1',
        profiles: [],
      }),
    );
    await repository.create(
      new Student({
        id: '2',
        schoolClassId: 'c1',
        name: 'B',
        gradeId: '1',
        profiles: [],
      }),
    );
    await repository.create(
      new Student({
        id: '3',
        schoolClassId: 'c2',
        name: 'C',
        gradeId: '1',
        profiles: [],
      }),
    );

    const all = await repository.findByClassId('c1');
    expect(all.length).toBe(2);
  });
});
