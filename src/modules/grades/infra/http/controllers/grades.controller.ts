import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { CreateGradeUseCase } from '@/modules/grades/application/use-cases/create-grade/create-grade.use-case';
import { CreateGradeInput } from '@/modules/grades/application/use-cases/create-grade/create-grade.input';
import { Response } from 'express';

@Controller('grades')
export class GradesController {
  constructor(private readonly createGradeUseCase: CreateGradeUseCase) {}

  @Post()
  async create(@Body() input: CreateGradeInput, @Res() res: Response) {
    const result = await this.createGradeUseCase.execute(input);

    if (result.isSuccess) {
      return res.status(HttpStatus.CREATED).json(result.getValue());
    } else {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: result.errorValue() });
    }
  }
}
