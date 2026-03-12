import { Injectable, Logger } from '@nestjs/common';
import { ITeachersRepository } from '@/modules/teachers/domain/repositories/teachers.repository';
import { CreateTeacherInput } from './create-teacher.input';
import { CreateTeacherOutput } from './create-teacher.output';
import { Result } from '@/shared/domain/utils/result';
import { Teacher } from '@/modules/teachers/domain/entities/teacher.entity';

@Injectable()
export class CreateTeacherUseCase {
  private readonly logger = new Logger(CreateTeacherUseCase.name);

  constructor(private readonly teachersRepository: ITeachersRepository) {}

  async execute(input: CreateTeacherInput): Promise<Result<CreateTeacherOutput>> {
    try {
      const newTeacher = new Teacher({
        id: crypto.randomUUID(),
        userId: input.userId,
        name: input.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await this.teachersRepository.create(newTeacher);

      return Result.ok({
        id: newTeacher.id,
        userId: newTeacher.userId,
        name: newTeacher.name,
        createdAt: newTeacher.createdAt,
      });
    } catch (error) {
      this.logger.error('Unexpected error creating teacher', error instanceof Error ? error.stack : error);
      return Result.fail('An unexpected error occurred while creating the teacher.');
    }
  }
}
