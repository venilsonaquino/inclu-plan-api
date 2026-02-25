import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { GenerateLessonUseCase } from '@/modules/ai/application/use-cases/generate-lesson/generate-lesson.use-case';
import { GenerateMaterialUseCase } from '@/modules/ai/application/use-cases/generate-material/generate-material.use-case';

@Controller('ai')
export class AiController {
  constructor(
    private readonly generateLessonUseCase: GenerateLessonUseCase,
    private readonly generateMaterialUseCase: GenerateMaterialUseCase,
  ) { }

  @Post('lesson-plan')
  async generateLessonPlan(@Body() body: any) {
    const result = await this.generateLessonUseCase.execute(body);
    if (result.isFailure) {
      throw new HttpException(result.errorValue(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return result.getValue();
  }

  @Post('pedagogical-material')
  async generatePedagogicalMaterial(@Body() body: any) {
    const result = await this.generateMaterialUseCase.execute(body);
    if (result.isFailure) {
      throw new HttpException(result.errorValue(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return result.getValue();
  }
}
