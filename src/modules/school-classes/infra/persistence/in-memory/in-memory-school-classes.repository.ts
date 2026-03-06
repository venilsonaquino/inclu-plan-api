import { Injectable } from '@nestjs/common';
import { ISchoolClassesRepository } from '@/modules/school-classes/domain/repositories/school-classes.repository';
import { SchoolClass } from '@/modules/school-classes/domain/entities/school-class.entity';

@Injectable()
export class InMemorySchoolClassesRepository implements ISchoolClassesRepository {
  private schoolClasses: SchoolClass[] = [];

  async create(schoolClass: SchoolClass): Promise<void> {
    this.schoolClasses.push(schoolClass);
  }

  async findById(id: string): Promise<SchoolClass | null> {
    const schoolClass = this.schoolClasses.find(c => c.id === id);
    return schoolClass ? schoolClass : null;
  }

  async findByTeacherId(teacherId: string): Promise<SchoolClass[]> {
    return this.schoolClasses.filter(c => c.teacherId === teacherId);
  }
}
