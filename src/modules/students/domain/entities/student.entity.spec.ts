import { Student } from './student.entity';

describe('StudentEntity', () => {
  it('should instantiate correctly', () => {
    const student = new Student({
      name: 'John Doe',
      gradeId: 'grade-1',
      neurodivergencies: ['profile-1'],
      notes: 'Some notes',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, '1');

    expect(student).toBeDefined();
    expect(student.notes).toBe('Some notes');
  });
});
