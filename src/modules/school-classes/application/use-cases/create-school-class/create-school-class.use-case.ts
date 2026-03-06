import { Injectable, Logger } from '@nestjs/common';
import { ISchoolClassesRepository } from '@/modules/school-classes/domain/repositories/school-classes.repository';
import { CreateSchoolClassInput } from './create-school-class.input';
import { CreateSchoolClassOutput } from './create-school-class.output';
import { Result } from '@/shared/domain/utils/result';
import { SchoolClass } from '@/modules/school-classes/domain/entities/school-class.entity';

@Injectable()
export class CreateSchoolClassUseCase {
  private readonly logger = new Logger(CreateSchoolClassUseCase.name);

  constructor(private readonly schoolClassesRepository: ISchoolClassesRepository) {}

  async execute(input: CreateSchoolClassInput): Promise<Result<CreateSchoolClassOutput>> {
    try {
      const newClass = new SchoolClass({
        id: crypto.randomUUID(),
        name: input.name,
        teacherId: input.teacherId, // In the future, parsed from authentication token
        createdAt: new Date(),
        updatedAt: new Date(),
      });

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
