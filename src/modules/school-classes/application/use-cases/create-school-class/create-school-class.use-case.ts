import { Injectable, Logger } from '@nestjs/common';
import { ISchoolClassesRepository } from '@/modules/school-classes/domain/repositories/school-classes.repository';
import { ITeachersRepository } from '@/modules/teachers/domain/repositories/teachers.repository';
import { CreateSchoolClassInput } from './create-school-class.input';
import { CreateSchoolClassOutput } from './create-school-class.output';
import { Result } from '@/shared/domain/utils/result';
import { SchoolClass } from '@/modules/school-classes/domain/entities/school-class.entity';

@Injectable()
export class CreateSchoolClassUseCase {
  private readonly logger = new Logger(CreateSchoolClassUseCase.name);

  constructor(
    private readonly schoolClassesRepository: ISchoolClassesRepository,
    private readonly teachersRepository: ITeachersRepository,
  ) {}

  async execute(input: CreateSchoolClassInput): Promise<Result<CreateSchoolClassOutput>> {
    try {
      if (!input.userId) {
        return Result.fail('User ID is required to create a school class.');
      }

      const teacher = await this.teachersRepository.findByUserId(input.userId);
      if (!teacher) {
        return Result.fail('Teacher record not found.');
      }

      const newClass = new SchoolClass(
        {
          name: input.name,
          teacherId: teacher.id,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        crypto.randomUUID(),
      );

      await this.schoolClassesRepository.create(newClass);

      return Result.ok({
        id: newClass.id,
        name: newClass.name,
        teacherId: newClass.teacherId,
        isActive: newClass.isActive,
        createdAt: newClass.createdAt,
      });
    } catch (error) {
      this.logger.error('Unexpected error creating school class', error instanceof Error ? error.stack : error);
      return Result.fail('An unexpected error occurred while creating the school class.');
    }
  }
}
