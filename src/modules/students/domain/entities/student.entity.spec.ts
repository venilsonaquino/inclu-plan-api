import { Student } from './student.entity';

describe('StudentEntity', () => {
  it('should instantiate correctly', () => {
    const student = new Student({
      id: '1',
      name: 'John Doe',
      gradeId: 'grade-1',
      profiles: ['profile-1'],
      notes: 'Some notes',
    });

    expect(student).toBeDefined();
    expect(student.notes).toBe('Some notes');
  });
});
