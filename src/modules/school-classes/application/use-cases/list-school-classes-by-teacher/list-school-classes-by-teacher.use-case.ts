import { Injectable, Logger } from '@nestjs/common';
import { ISchoolClassesRepository } from '@/modules/school-classes/domain/repositories/school-classes.repository';
import { ITeachersRepository } from '@/modules/teachers/domain/repositories/teachers.repository';
import { ListSchoolClassesByTeacherInput } from './list-school-classes-by-teacher.input';
import { ListSchoolClassesByTeacherOutput } from './list-school-classes-by-teacher.output';
import { Result } from '@/shared/domain/utils/result';

@Injectable()
export class ListSchoolClassesByTeacherUseCase {
  private readonly logger = new Logger(ListSchoolClassesByTeacherUseCase.name);

  constructor(
    private readonly schoolClassesRepository: ISchoolClassesRepository,
    private readonly teachersRepository: ITeachersRepository,
  ) {}

  async execute(input: ListSchoolClassesByTeacherInput): Promise<Result<ListSchoolClassesByTeacherOutput>> {
    try {
      if (!input.userId) {
        return Result.fail('User ID is required to list school classes.');
      }

      const teacher = await this.teachersRepository.findByUserId(input.userId);
      if (!teacher) {
        return Result.ok([]); // Either Ok([]) or Fail, but OK([]) is safer if user is not a teacher yet
      }

      const classes = await this.schoolClassesRepository.findByTeacherId(teacher.id);

      const output: ListSchoolClassesByTeacherOutput = classes.map((c) => ({
        id: c.id,
        name: c.name,
        isActive: c.isActive,
        students: (c.students || []).map((s: any) => ({
          id: s.id,
          name: s.name,
          gradeId: s.gradeId,
          isActive: s.isActive,
        })),
        createdAt: c.createdAt.toISOString(),
      }));

      return Result.ok(output);
    } catch (error) {
      this.logger.error('Unexpected error listing school classes', error instanceof Error ? error.stack : error);
      return Result.fail('An unexpected error occurred while listing the school classes.');
    }
  }
}
