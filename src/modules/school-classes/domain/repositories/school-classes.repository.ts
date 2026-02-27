import { SchoolClass } from '../entities/school-class.entity';

export abstract class ISchoolClassesRepository {
  abstract create(schoolClass: SchoolClass): Promise<void>;
  abstract findById(id: string): Promise<SchoolClass | null>;
  abstract findByTeacherId(teacherId: string): Promise<SchoolClass[]>;
}
