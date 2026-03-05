import { Injectable, Logger } from '@nestjs/common';
import { IStudentsRepository } from '@/modules/students/domain/repositories/students.repository';
import { CreateStudentInput } from './create-student.input';
import { CreateStudentOutput } from './create-student.output';
import { Result } from '@/shared/domain/utils/result';
import { Student } from '@/modules/students/domain/entities/student.entity';

@Injectable()
export class CreateStudentUseCase {
  private readonly logger = new Logger(CreateStudentUseCase.name);

  constructor(private readonly studentsRepository: IStudentsRepository) {}

  async execute(
    input: CreateStudentInput,
  ): Promise<Result<CreateStudentOutput>> {
    try {
      const newStudent = new Student({
        id: crypto.randomUUID(),
        name: input.name,
        gradeId: input.gradeId,
        profiles: input.profiles,
        schoolClassId: input.schoolClassId,
        notes: input.notes,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await this.studentsRepository.create(newStudent);

      return Result.ok({
        id: newStudent.id,
        name: newStudent.name,
        gradeId: newStudent.gradeId,
        profiles: newStudent.profiles,
        schoolClassId: newStudent.schoolClassId,
        createdAt: newStudent.createdAt,
      });
    } catch (error) {
      this.logger.error(
        'Unexpected error creating student',
        error instanceof Error ? error.stack : error,
      );
      return Result.fail(
        'An unexpected error occurred while creating the student.',
      );
    }
  }
}
