import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { GenerateLessonUseCase } from '@/modules/ai/application/use-cases/generate-lesson/generate-lesson.use-case';
import { GenerateCardsUseCase } from '@/modules/ai/application/use-cases/generate-cards/generate-cards.use-case';
import { GenerateBoardUseCase } from '@/modules/ai/application/use-cases/generate-board/generate-board.use-case';
import { GenerateHomeworkUseCase } from '@/modules/ai/application/use-cases/generate-homework/generate-homework.use-case';

@Controller('ai')
export class AiController {
  constructor(
    private readonly generateLessonUseCase: GenerateLessonUseCase,
    private readonly generateCardsUseCase: GenerateCardsUseCase,
    private readonly generateBoardUseCase: GenerateBoardUseCase,
    private readonly generateHomeworkUseCase: GenerateHomeworkUseCase,
  ) { }

  @Post('lesson-plan')
  async generateLessonPlan(@Body() body: any) {
    const result = await this.generateLessonUseCase.execute(body);
    if (result.isFailure) {
      throw new HttpException(result.errorValue(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return result.getValue();
  }

  @Post('pedagogical-material/cards')
  async generateCards(@Body() body: any) {
    const result = await this.generateCardsUseCase.execute(body);
    if (result.isFailure) {
      throw new HttpException(result.errorValue(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return result.getValue();
  }

  @Post('pedagogical-material/board')
  async generateBoard(@Body() body: any) {
    const result = await this.generateBoardUseCase.execute(body);
    if (result.isFailure) {
      throw new HttpException(result.errorValue(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return result.getValue();
  }

  @Post('pedagogical-material/homework')
  async generateHomework(@Body() body: any) {
    const result = await this.generateHomeworkUseCase.execute(body);
    if (result.isFailure) {
      throw new HttpException(result.errorValue(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return result.getValue();
  }
}
