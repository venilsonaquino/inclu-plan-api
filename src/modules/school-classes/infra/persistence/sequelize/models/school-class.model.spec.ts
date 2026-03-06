import 'reflect-metadata';
import { SchoolClassModel } from './school-class.model';
import { SchoolClass } from '@/modules/school-classes/domain/entities/school-class.entity';

describe('SchoolClassModel', () => {
  it('should map to domain correctly', () => {
    const model = Object.create(SchoolClassModel.prototype);
    Object.assign(model, {
      id: '1',
      name: 'Turma A',
      teacherId: 't1',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const domain = model.toDomain();

    expect(domain).toBeInstanceOf(SchoolClass);
    expect(domain.id).toBe('1');
    expect(domain.name).toBe('Turma A');
    expect(domain.teacherId).toBe('t1');
    expect(domain.isActive).toBe(true);
  });
});
