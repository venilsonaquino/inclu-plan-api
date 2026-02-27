import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AssignProfileToStudentUseCase } from '@/modules/student-learning-profiles/application/use-cases/assign-profile-to-student/assign-profile-to-student.use-case';
import { AssignProfileInput } from '@/modules/student-learning-profiles/application/use-cases/assign-profile-to-student/assign-profile.input';
import { Response } from 'express';

@Controller('student-learning-profiles')
export class StudentLearningProfilesController {
  constructor(private readonly assignProfileToStudentUseCase: AssignProfileToStudentUseCase) { }

  @Post('assign')
  async assign(@Body() input: AssignProfileInput, @Res() res: Response) {
    const result = await this.assignProfileToStudentUseCase.execute(input);

    if (result.isSuccess) {
      return res.status(HttpStatus.CREATED).json(result.getValue());
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: result.errorValue() });
    }
  }
}
