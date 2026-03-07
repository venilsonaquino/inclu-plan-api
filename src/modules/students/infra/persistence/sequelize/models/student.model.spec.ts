import 'reflect-metadata';
import { StudentModel } from './student.model';
import { Student } from '@/modules/students/domain/entities/student.entity';

describe('StudentModel', () => {
  it('should map to domain correctly', () => {
    const model = Object.create(StudentModel.prototype);
    Object.assign(model, {
      id: '1',
      name: 'John Doe',
      gradeId: 'g1',
      schoolClassId: 'c1',
      notes: 'Notes',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const domain = model.toDomain();

    expect(domain).toBeInstanceOf(Student);
    expect(domain.id).toBe('1');
    expect(domain.name).toBe('John Doe');
    expect(domain.gradeId).toBe('g1');
    expect(domain.schoolClassId).toBe('c1');
    expect(domain.notes).toBe('Notes');
    expect(domain.isActive).toBe(true);
  });
});
