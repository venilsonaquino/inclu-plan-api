import { Teacher } from '../entities/teacher.entity';

export abstract class ITeachersRepository {
  abstract create(teacher: Teacher): Promise<void>;
  abstract findById(id: string): Promise<Teacher | null>;
}
