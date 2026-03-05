export interface MaterialCacheRecord<T = any> {
  id: string;
  contextHash: string;
  payloadEmbedding: number[];
  materialResult: T;
}

export const I_MATERIAL_CACHE_REPOSITORY = 'IMaterialCacheRepository';

export interface IMaterialCacheRepository {
  findSimilar<T = any>(
    contextHash: string,
    payloadVector: number[],
    threshold: number,
  ): Promise<MaterialCacheRecord<T> | null>;
  save<T = any>(record: MaterialCacheRecord<T>): Promise<void>;

  // For testing purposes
  clear(): void;
  count(): number;
}
