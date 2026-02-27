import { Injectable } from '@nestjs/common';
import { IGradesRepository } from '@/modules/grades/domain/repositories/grades.repository';
import { CreateGradeInput } from './create-grade.input';
import { CreateGradeOutput } from './create-grade.output';
import { Result } from '@/shared/domain/utils/result';
import { Grade } from '@/modules/grades/domain/entities/grade.entity';

@Injectable()
export class CreateGradeUseCase {
  constructor(private readonly gradesRepository: IGradesRepository) { }

  async execute(input: CreateGradeInput): Promise<Result<CreateGradeOutput>> {
    try {
      const newGrade = new Grade({
        id: crypto.randomUUID(),
        name: input.name,
        description: input.description,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await this.gradesRepository.create(newGrade);

      return Result.ok({
        id: newGrade.id,
        name: newGrade.name,
        description: newGrade.description,
        createdAt: newGrade.createdAt
      });

    } catch (error) {
      return Result.fail('An unexpected error occurred while creating the grade level.');
    }
  }
}
