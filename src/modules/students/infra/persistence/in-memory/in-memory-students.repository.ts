import { Injectable } from '@nestjs/common';
import { IStudentsRepository } from '@/modules/students/domain/repositories/students.repository';
import { Student } from '@/modules/students/domain/entities/student.entity';

@Injectable()
export class InMemoryStudentsRepository implements IStudentsRepository {
  private students: Student[] = [];

  async create(student: Student): Promise<void> {
    this.students.push(student);
  }

  async findById(id: string): Promise<Student | null> {
    const student = this.students.find((s) => s.id === id);
    return student ? student : null;
  }

  async findByClassId(schoolClassId: string): Promise<Student[]> {
    return this.students.filter((s) => s.schoolClassId === schoolClassId);
  }
}
