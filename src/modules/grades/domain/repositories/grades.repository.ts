import { Grade } from '../entities/grade.entity';

export abstract class IGradesRepository {
  abstract create(grade: Grade): Promise<void>;
  abstract findById(id: string): Promise<Grade | null>;
  abstract findAll(): Promise<Grade[]>;
}
