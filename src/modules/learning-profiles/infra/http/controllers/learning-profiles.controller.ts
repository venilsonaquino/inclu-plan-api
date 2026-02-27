import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { CreateLearningProfileUseCase } from '@/modules/learning-profiles/application/use-cases/create-learning-profile/create-learning-profile.use-case';
import { CreateLearningProfileInput } from '@/modules/learning-profiles/application/use-cases/create-learning-profile/create-learning-profile.input';
import { Response } from 'express';

@Controller('learning-profiles')
export class LearningProfilesController {
  constructor(private readonly createLearningProfileUseCase: CreateLearningProfileUseCase) { }

  @Post()
  async create(@Body() input: CreateLearningProfileInput, @Res() res: Response) {
    const result = await this.createLearningProfileUseCase.execute(input);

    if (result.isSuccess) {
      return res.status(HttpStatus.CREATED).json(result.getValue());
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: result.errorValue() });
    }
  }
}
