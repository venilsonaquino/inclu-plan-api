import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { CreateStudentUseCase } from '@/modules/students/application/use-cases/create-student/create-student.use-case';
import { CreateStudentInput } from '@/modules/students/application/use-cases/create-student/create-student.input';
import { Response } from 'express';

@Controller('students')
export class StudentsController {
  constructor(private readonly createStudentUseCase: CreateStudentUseCase) {}

  @Post()
  async create(@Body() input: CreateStudentInput, @Res() res: Response) {
    const result = await this.createStudentUseCase.execute(input);

    if (result.isSuccess) {
      return res.status(HttpStatus.CREATED).json(result.getValue());
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: result.errorValue() });
    }
  }
}
