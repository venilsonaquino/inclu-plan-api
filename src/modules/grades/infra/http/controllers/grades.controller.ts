import { Controller, Post, Body, Res, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/identity/infra/http/guards/jwt-auth.guard';
import { CreateGradeUseCase } from '@/modules/grades/application/use-cases/create-grade/create-grade.use-case';
import { ListGradesUseCase } from '@/modules/grades/application/use-cases/list-grades/list-grades.use-case';
import { CreateGradeInput } from '@/modules/grades/application/use-cases/create-grade/create-grade.input';
import { Response } from 'express';

@Controller('grades')
@UseGuards(JwtAuthGuard)
export class GradesController {
  constructor(
    private readonly createGradeUseCase: CreateGradeUseCase,
    private readonly listGradesUseCase: ListGradesUseCase,
  ) { }

  @Post()
  async create(@Body() input: CreateGradeInput, @Res() res: Response) {
    const result = await this.createGradeUseCase.execute(input);

    if (result.isSuccess) {
      return res.status(HttpStatus.CREATED).json(result.getValue());
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: result.errorValue() });
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.listGradesUseCase.execute();

    if (result.isSuccess) {
      return res.status(HttpStatus.OK).json(result.getValue());
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: result.errorValue() });
    }
  }
}
