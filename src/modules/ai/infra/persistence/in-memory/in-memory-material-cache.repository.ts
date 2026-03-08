import { Injectable } from '@nestjs/common';
import { IMaterialCacheRepository, MaterialCacheEntry } from '../../../domain/repositories/material-cache.repository.interface';

@Injectable()
export class InMemoryMaterialCacheRepository implements IMaterialCacheRepository {
  private entries: MaterialCacheEntry[] = [];

  async save(entry: MaterialCacheEntry): Promise<void> {
    const index = this.entries.findIndex((e) => e.id === entry.id);
    if (index !== -1) {
      this.entries[index] = entry;
    } else {
      this.entries.push(entry);
    }
  }

  async findSimilar(
    contextHash: string,
    embedding: number[],
    threshold: number,
  ): Promise<MaterialCacheEntry | null> {
    // Busca simples por contexto, já que é in-memory mockado
    return this.entries.find((e) => e.contextHash === contextHash) || null;
  }

  async clear(): Promise<void> {
    this.entries = [];
  }
}
