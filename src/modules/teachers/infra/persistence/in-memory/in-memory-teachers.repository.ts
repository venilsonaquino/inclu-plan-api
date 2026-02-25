import { Injectable } from '@nestjs/common';
import { ITeachersRepository } from '@/modules/teachers/domain/repositories/teachers.repository';
import { Teacher } from '@/modules/teachers/domain/entities/teacher.entity';

@Injectable()
export class InMemoryTeachersRepository implements ITeachersRepository {
  private teachers: Teacher[] = [];

  async create(teacher: Teacher): Promise<void> {
    this.teachers.push(teacher);
  }

  async findByEmail(email: string): Promise<Teacher | null> {
    const teacher = this.teachers.find(t => t.email === email);
    return teacher ? teacher : null;
  }

  async findById(id: string): Promise<Teacher | null> {
    const teacher = this.teachers.find(t => t.id === id);
    return teacher ? teacher : null;
  }
}
