import { Injectable } from '@nestjs/common';
import { IGradesRepository } from '@/modules/grades/domain/repositories/grades.repository';
import { Grade } from '@/modules/grades/domain/entities/grade.entity';

@Injectable()
export class InMemoryGradesRepository implements IGradesRepository {
  private grades: Grade[] = [];

  async create(grade: Grade): Promise<void> {
    this.grades.push(grade);
  }

  async findById(id: string): Promise<Grade | null> {
    const grade = this.grades.find((g) => g.id === id);
    return grade ? grade : null;
  }

  async findAll(): Promise<Grade[]> {
    return this.grades;
  }
}
