import { Grade } from './grade.entity';

describe('Grade Entity', () => {
  it('should create a grade with default values', () => {
    const grade = new Grade({});
    expect(grade.id).toBeDefined();
    expect(grade.name).toBe('');
    expect(grade.createdAt).toBeInstanceOf(Date);
    expect(grade.updatedAt).toBeInstanceOf(Date);
  });

  it('should create a grade with provided values', () => {
    const props = {
      name: '1º Ano',
      description: 'Primeiro ano do ensino fundamental',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const id = 'grade-id';
    const grade = new Grade(props, id);

    expect(grade.id).toBe(id);
    expect(grade.name).toBe(props.name);
    expect(grade.description).toBe(props.description);
    expect(grade.createdAt).toBe(props.createdAt);
    expect(grade.updatedAt).toBe(props.updatedAt);
  });
});
