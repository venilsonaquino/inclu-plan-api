import { Module } from '@nestjs/common';
import { NeurodivergenciesController } from './infra/http/controllers/neurodivergencies.controller';
import { CreateNeurodivergencyUseCase } from './application/use-cases/create-neurodivergency/create-neurodivergency.use-case';
import { ListNeurodivergenciesUseCase } from './application/use-cases/list-neurodivergencies/list-neurodivergencies.use-case';
import { INeurodivergenciesRepository } from './domain/repositories/neurodivergencies.repository';
import { SequelizeNeurodivergenciesRepository } from './infra/persistence/sequelize/repositories/sequelize-neurodivergencies.repository';
import { NeurodivergencyModel } from './infra/persistence/sequelize/models/neurodivergency.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([NeurodivergencyModel])],
  controllers: [NeurodivergenciesController],
  providers: [
    CreateNeurodivergencyUseCase,
    ListNeurodivergenciesUseCase,
    {
      provide: INeurodivergenciesRepository,
      useClass: SequelizeNeurodivergenciesRepository,
    },
  ],
  exports: [INeurodivergenciesRepository],
})
export class NeurodivergenciesModule {}
