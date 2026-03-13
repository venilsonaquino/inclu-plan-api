import { Controller, Post, Get, Body, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/identity/infra/http/guards/jwt-auth.guard';
import { CreateNeurodivergencyUseCase } from '@/modules/neurodivergencies/application/use-cases/create-neurodivergency/create-neurodivergency.use-case';
import { ListNeurodivergenciesUseCase } from '@/modules/neurodivergencies/application/use-cases/list-neurodivergencies/list-neurodivergencies.use-case';
import { CreateNeurodivergencyInput } from '@/modules/neurodivergencies/application/use-cases/create-neurodivergency/create-neurodivergency.input';
import { Response } from 'express';

@Controller('neurodivergencies')
@UseGuards(JwtAuthGuard)
export class NeurodivergenciesController {
  constructor(
    private readonly createNeurodivergencyUseCase: CreateNeurodivergencyUseCase,
    private readonly listNeurodivergenciesUseCase: ListNeurodivergenciesUseCase,
  ) {}

  @Post()
  async create(@Body() input: CreateNeurodivergencyInput, @Res() res: Response) {
    const result = await this.createNeurodivergencyUseCase.execute(input);

    if (result.isSuccess) {
      return res.status(HttpStatus.CREATED).json(result.getValue());
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: result.errorValue() });
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.listNeurodivergenciesUseCase.execute();

    if (result.isSuccess) {
      return res.status(HttpStatus.OK).json(result.getValue());
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: result.errorValue() });
    }
  }
}
