import 'reflect-metadata';
import { GradeModel } from './grade.model';
import { Grade } from '@/modules/grades/domain/entities/grade.entity';

describe('GradeModel', () => {
  it('should map to domain correctly', () => {
    const model = Object.create(GradeModel.prototype);
    Object.assign(model, {
      id: '1',
      name: '1º Ano',
      description: 'Primeiro ano',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const domain = model.toDomain();

    expect(domain).toBeInstanceOf(Grade);
    expect(domain.id).toBe('1');
    expect(domain.name).toBe('1º Ano');
    expect(domain.description).toBe('Primeiro ano');
  });
});
