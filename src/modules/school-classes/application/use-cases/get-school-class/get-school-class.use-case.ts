import { Injectable, Logger } from '@nestjs/common';
import { ISchoolClassesRepository } from '@/modules/school-classes/domain/repositories/school-classes.repository';
import { ITeachersRepository } from '@/modules/teachers/domain/repositories/teachers.repository';
import { GetSchoolClassInput } from './get-school-class.input';
import { GetSchoolClassOutput } from './get-school-class.output';
import { Result } from '@/shared/domain/utils/result';

@Injectable()
export class GetSchoolClassUseCase {
  private readonly logger = new Logger(GetSchoolClassUseCase.name);

  constructor(
    private readonly schoolClassesRepository: ISchoolClassesRepository,
    private readonly teachersRepository: ITeachersRepository,
  ) {}

  async execute(input: GetSchoolClassInput): Promise<Result<GetSchoolClassOutput>> {
    try {
      if (!input.id) {
        return Result.fail('School class ID is required.');
      }

      if (!input.userId) {
        return Result.fail('User ID is required.');
      }

      const teacher = await this.teachersRepository.findByUserId(input.userId);
      if (!teacher) {
        return Result.fail('Teacher record not found.');
      }

      const schoolClass = await this.schoolClassesRepository.findById(input.id);
      if (!schoolClass) {
        return Result.fail('School class not found.');
      }

      if (schoolClass.teacherId !== teacher.id) {
        return Result.fail('You do not have permission to access this school class.');
      }

      const output: GetSchoolClassOutput = {
        id: schoolClass.id,
        name: schoolClass.name,
        isActive: schoolClass.isActive,
        students: (schoolClass.students || []).map((s: any) => ({
          id: s.id,
          name: s.name,
          gradeId: s.gradeId,
          isActive: s.isActive,
          neurodivergencies: s.neurodivergencyDetails || [],
        })),
        createdAt: schoolClass.createdAt.toISOString(),
      };

      return Result.ok(output);
    } catch (error) {
      this.logger.error('Unexpected error getting school class', error instanceof Error ? error.stack : error);
      return Result.fail('An unexpected error occurred while getting the school class.');
    }
  }
}
