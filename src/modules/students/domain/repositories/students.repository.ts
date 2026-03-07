import { Student } from '../entities/student.entity';

export abstract class IStudentsRepository {
  abstract create(student: Student): Promise<void>;
  abstract findById(id: string): Promise<Student | null>;
  abstract findByIds(ids: string[]): Promise<Student[]>;
  abstract findByClassId(schoolClassId: string): Promise<Student[]>;
}
