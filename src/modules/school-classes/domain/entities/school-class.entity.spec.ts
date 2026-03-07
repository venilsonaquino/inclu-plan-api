import { SchoolClass } from './school-class.entity';

describe('SchoolClass Entity', () => {
  it('should create a school class with default values', () => {
    const schoolClass = new SchoolClass({});
    expect(schoolClass.id).toBeDefined();
    expect(schoolClass.name).toBe('');
    expect(schoolClass.teacherId).toBe('');
    expect(schoolClass.isActive).toBe(true);
    expect(schoolClass.createdAt).toBeInstanceOf(Date);
    expect(schoolClass.updatedAt).toBeInstanceOf(Date);
  });

  it('should create a school class with provided values', () => {
    const props = {
      name: 'Turma A',
      teacherId: 'teacher-123',
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const id = 'class-id';
    const schoolClass = new SchoolClass(props, id);

    expect(schoolClass.id).toBe(id);
    expect(schoolClass.name).toBe(props.name);
    expect(schoolClass.teacherId).toBe(props.teacherId);
    expect(schoolClass.isActive).toBe(false);
    expect(schoolClass.createdAt).toBe(props.createdAt);
    expect(schoolClass.updatedAt).toBe(props.updatedAt);
  });
});
