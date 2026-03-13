import { Injectable, Logger } from '@nestjs/common';
import { INeurodivergenciesRepository } from '@/modules/neurodivergencies/domain/repositories/neurodivergencies.repository';
import { CreateNeurodivergencyInput } from './create-neurodivergency.input';
import { CreateNeurodivergencyOutput } from './create-neurodivergency.output';
import { Result } from '@/shared/domain/utils/result';
import { Neurodivergency } from '@/modules/neurodivergencies/domain/entities/neurodivergency.entity';

@Injectable()
export class CreateNeurodivergencyUseCase {
  private readonly logger = new Logger(CreateNeurodivergencyUseCase.name);

  constructor(private readonly neurodivergenciesRepository: INeurodivergenciesRepository) {}

  async execute(input: CreateNeurodivergencyInput): Promise<Result<CreateNeurodivergencyOutput>> {
    try {
      const newNeurodivergency = new Neurodivergency(
        {
          name: input.name,
          description: input.description,
          icon: input.icon,
          position: input.position,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        crypto.randomUUID(),
      );

      await this.neurodivergenciesRepository.create(newNeurodivergency);

      return Result.ok({
        id: newNeurodivergency.id,
        name: newNeurodivergency.name,
        description: newNeurodivergency.description,
        icon: newNeurodivergency.icon,
        position: newNeurodivergency.position,
        createdAt: newNeurodivergency.createdAt,
      });
    } catch (error) {
      this.logger.error('Unexpected error creating neurodivergency', error instanceof Error ? error.stack : error);
      return Result.fail('An unexpected error occurred while creating the neurodivergency.');
    }
  }
}
