import { GenerateMaterialOutput } from '@/modules/ai/application/use-cases/generate-material/generate-material.output';

export interface MaterialCacheRecord {
  id: string;
  contextHash: string;
  payloadEmbedding: number[];
  materialResult: GenerateMaterialOutput;
}

export const I_MATERIAL_CACHE_REPOSITORY = 'IMaterialCacheRepository';

export interface IMaterialCacheRepository {
  findSimilar(contextHash: string, payloadVector: number[], threshold: number): Promise<MaterialCacheRecord | null>;
  save(record: MaterialCacheRecord): Promise<void>;

  // For testing purposes
  clear(): void;
  count(): number;
}
