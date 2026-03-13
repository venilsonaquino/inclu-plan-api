import { Injectable, Logger } from '@nestjs/common';
import { INeurodivergenciesRepository } from '@/modules/neurodivergencies/domain/repositories/neurodivergencies.repository';
import { ListNeurodivergenciesOutput } from './list-neurodivergencies.output';
import { Result } from '@/shared/domain/utils/result';

@Injectable()
export class ListNeurodivergenciesUseCase {
  private readonly logger = new Logger(ListNeurodivergenciesUseCase.name);

  constructor(private readonly neurodivergenciesRepository: INeurodivergenciesRepository) {}

  async execute(): Promise<Result<ListNeurodivergenciesOutput>> {
    try {
      const neurodivergencies = await this.neurodivergenciesRepository.findAll();

      const output: ListNeurodivergenciesOutput = neurodivergencies.map((n) => ({
        id: n.id,
        name: n.name,
        description: n.description,
        icon: n.icon,
        position: n.position,
        createdAt: n.createdAt,
      }));

      return Result.ok(output);
    } catch (error) {
      this.logger.error('Unexpected error listing neurodivergencies', error instanceof Error ? error.stack : error);
      return Result.fail('An unexpected error occurred while listing the neurodivergencies.');
    }
  }
}
