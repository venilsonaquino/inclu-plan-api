export const I_MATERIAL_CACHE_REPOSITORY = 'IMaterialCacheRepository';

export interface MaterialCacheEntry {
  id: string;
  contextHash: string;
  payloadEmbedding: number[];
  materialResult: any;
  createdAt?: Date;
}

export interface IMaterialCacheRepository {
  save(entry: MaterialCacheEntry): Promise<void>;
  findSimilar(
    contextHash: string,
    embedding: number[],
    threshold: number,
  ): Promise<MaterialCacheEntry | null>;
  clear(): Promise<void>;
}
