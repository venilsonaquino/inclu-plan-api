import { Controller, Post, Body, Res, HttpStatus, UseGuards, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/identity/infra/http/guards/jwt-auth.guard';
import { CurrentUser, ValidatedUser } from '@/modules/identity/infra/http/decorators/current-user.decorator';
import { CreateSchoolClassUseCase } from '@/modules/school-classes/application/use-cases/create-school-class/create-school-class.use-case';
import { CreateSchoolClassInput } from '@/modules/school-classes/application/use-cases/create-school-class/create-school-class.input';
import { Response } from 'express';

@Controller('school-classes')
@UseGuards(JwtAuthGuard)
export class SchoolClassesController {
  constructor(
    private readonly createSchoolClassUseCase: CreateSchoolClassUseCase,
  ) {}

  @Post()
  async create(
    @Body() input: CreateSchoolClassInput,
    @CurrentUser() user: ValidatedUser,
    @Res() res: Response
  ) {
    input.userId = user.id;

    const result = await this.createSchoolClassUseCase.execute(input);

    if (result.isSuccess) {
      return res.status(HttpStatus.CREATED).json(result.getValue());
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: result.errorValue() });
    }
  }
}
