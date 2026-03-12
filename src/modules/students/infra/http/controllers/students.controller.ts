import { Controller, Post, Body, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/identity/infra/http/guards/jwt-auth.guard';
import { CreateStudentUseCase } from '@/modules/students/application/use-cases/create-student/create-student.use-case';
import { CreateStudentInput } from '@/modules/students/application/use-cases/create-student/create-student.input';
import { Response } from 'express';

@Controller('students')
@UseGuards(JwtAuthGuard)
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
