import { Controller, Get, Query, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/identity/infra/http/guards/jwt-auth.guard';
import { CurrentUser, ValidatedUser } from '@/modules/identity/infra/http/decorators/current-user.decorator';
import { ListLessonPlansUseCase } from '@/modules/lessons/application/use-cases/list-lesson-plans/list-lesson-plans.use-case';
import { Response } from 'express';

@Controller('lessons')
@UseGuards(JwtAuthGuard)
export class LessonsController {
  constructor(private readonly listLessonPlansUseCase: ListLessonPlansUseCase) {}

  @Get()
  async list(@Query('limit') limit: string, @CurrentUser() user: ValidatedUser, @Res() res: Response) {
    const result = await this.listLessonPlansUseCase.execute({
      userId: user.id,
      limit: limit ? parseInt(limit, 10) : undefined,
    });

    if (result.isSuccess) {
      return res.status(HttpStatus.OK).json(result.getValue());
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: result.errorValue() });
    }
  }
}

