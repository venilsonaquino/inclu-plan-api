import { Controller, Post, Body, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/identity/infra/http/guards/jwt-auth.guard';
import { CreateNeurodivergencyUseCase } from '@/modules/neurodivergencies/application/use-cases/create-neurodivergency/create-neurodivergency.use-case';
import { CreateNeurodivergencyInput } from '@/modules/neurodivergencies/application/use-cases/create-neurodivergency/create-neurodivergency.input';
import { Response } from 'express';

@Controller('neurodivergencies')
@UseGuards(JwtAuthGuard)
export class NeurodivergenciesController {
  constructor(private readonly createNeurodivergencyUseCase: CreateNeurodivergencyUseCase) {}

  @Post()
  async create(@Body() input: CreateNeurodivergencyInput, @Res() res: Response) {
    const result = await this.createNeurodivergencyUseCase.execute(input);

    if (result.isSuccess) {
      return res.status(HttpStatus.CREATED).json(result.getValue());
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: result.errorValue() });
    }
  }
}
