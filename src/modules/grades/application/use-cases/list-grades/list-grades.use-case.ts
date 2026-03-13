import { Injectable, Logger } from '@nestjs/common';
import { IGradesRepository } from '@/modules/grades/domain/repositories/grades.repository';
import { ListGradesOutput } from './list-grades.output';
import { Result } from '@/shared/domain/utils/result';

@Injectable()
export class ListGradesUseCase {
  private readonly logger = new Logger(ListGradesUseCase.name);

  constructor(private readonly gradesRepository: IGradesRepository) {}

  async execute(): Promise<Result<ListGradesOutput>> {
    try {
      const grades = await this.gradesRepository.findAll();

      const output: ListGradesOutput = grades
        .sort((a, b) => a.position - b.position)
        .map((g) => ({
          id: g.id,
          name: g.name,
          description: g.description,
          position: g.position,
          createdAt: g.createdAt,
        }));

      return Result.ok(output);
    } catch (error) {
      this.logger.error('Unexpected error listing grades', error instanceof Error ? error.stack : error);
      return Result.fail('An unexpected error occurred while listing the grade levels.');
    }
  }
}
