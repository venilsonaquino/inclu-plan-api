export interface MaterialCacheEntry {
  id: string;
  contextHash: string;
  payloadEmbedding: number[];
  materialResult: any;
  createdAt?: Date;
}

export abstract class IMaterialCacheRepository {
  abstract save(entry: MaterialCacheEntry): Promise<void>;
  abstract findSimilar(
    contextHash: string,
    embedding: number[],
    threshold: number,
  ): Promise<MaterialCacheEntry | null>;
  abstract clear(): Promise<void>;
}
