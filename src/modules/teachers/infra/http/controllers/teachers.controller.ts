import { Controller, Post, Body, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/identity/infra/http/guards/jwt-auth.guard';
import { CreateTeacherUseCase } from '@/modules/teachers/application/use-cases/create-teacher/create-teacher.use-case';
import { CreateTeacherInput } from '@/modules/teachers/application/use-cases/create-teacher/create-teacher.input';
import { Response } from 'express';

@Controller('teachers')
@UseGuards(JwtAuthGuard)
export class TeachersController {
  constructor(private readonly createTeacherUseCase: CreateTeacherUseCase) {}

  @Post()
  async create(@Body() input: CreateTeacherInput, @Res() res: Response) {
    const result = await this.createTeacherUseCase.execute(input);

    if (result.isSuccess) {
      return res.status(HttpStatus.CREATED).json(result.getValue());
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: result.errorValue() });
    }
  }
}
