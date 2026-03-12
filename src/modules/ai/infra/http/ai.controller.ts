import { Controller, Post, Body, HttpException, HttpStatus, UseGuards, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/identity/infra/http/guards/jwt-auth.guard';
import { CurrentUser, ValidatedUser } from '@/modules/identity/infra/http/decorators/current-user.decorator';
import { GenerateLessonUseCase } from '@/modules/ai/application/use-cases/generate-lesson/generate-lesson.use-case';
import { GenerateCardsUseCase } from '@/modules/ai/application/use-cases/generate-cards/generate-cards.use-case';
import { GenerateBoardUseCase } from '@/modules/ai/application/use-cases/generate-board/generate-board.use-case';
import { GenerateHomeworkUseCase } from '@/modules/ai/application/use-cases/generate-homework/generate-homework.use-case';
import { GenerateCardsInput } from '@/modules/ai/application/use-cases/generate-cards/generate-cards.input';
import { GenerateBoardInput } from '@/modules/ai/application/use-cases/generate-board/generate-board.input';
import { GenerateHomeworkInput } from '@/modules/ai/application/use-cases/generate-homework/generate-homework.input';

import { GenerateLessonInput } from '@/modules/ai/application/use-cases/generate-lesson/generate-lesson.input';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(
    private readonly generateLessonUseCase: GenerateLessonUseCase,
    private readonly generateCardsUseCase: GenerateCardsUseCase,
    private readonly generateBoardUseCase: GenerateBoardUseCase,
    private readonly generateHomeworkUseCase: GenerateHomeworkUseCase,
  ) { }

  @Post('lesson-plan')
  async generateLessonPlan(@Body() body: GenerateLessonInput, @CurrentUser() user: ValidatedUser) {
    body.userId = user.id;

    const result = await this.generateLessonUseCase.execute(body);
    if (result.isFailure) {
      throw new HttpException(result.errorValue(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return result.getValue();
  }

  @Post('pedagogical-material/cards')
  async generateCards(@Body() body: GenerateCardsInput) {
    const result = await this.generateCardsUseCase.execute(body);
    if (result.isFailure) {
      throw new HttpException(result.errorValue(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return result.getValue();
  }

  @Post('pedagogical-material/board')
  async generateBoard(@Body() body: GenerateBoardInput) {
    const result = await this.generateBoardUseCase.execute(body);
    if (result.isFailure) {
      throw new HttpException(result.errorValue(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return result.getValue();
  }

  @Post('pedagogical-material/homework')
  async generateHomework(@Body() body: GenerateHomeworkInput) {
    const result = await this.generateHomeworkUseCase.execute(body);
    if (result.isFailure) {
      throw new HttpException(result.errorValue(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return result.getValue();
  }
}
