import 'reflect-metadata';
import { TeacherModel } from './teacher.model';
import { Teacher } from '@/modules/teachers/domain/entities/teacher.entity';

describe('TeacherModel', () => {
  it('should map to domain correctly', () => {
    const model = Object.create(TeacherModel.prototype);
    Object.assign(model, {
      id: '1',
      userId: 'user-1',
      name: 'Jane Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const domain = model.toDomain();

    expect(domain).toBeInstanceOf(Teacher);
    expect(domain.id).toBe('1');
    expect(domain.userId).toBe('user-1');
    expect(domain.name).toBe('Jane Doe');
  });
});
