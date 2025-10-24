export interface EmbeddingRequest {
  tenantId: string;
  chunks: string[];
}

export interface EmbeddingVector {
  id: string;
  values: number[];
  text: string;
}

export const embedChunks = async ({ tenantId, chunks }: EmbeddingRequest): Promise<EmbeddingVector[]> => {
  return chunks.map((chunk, index) => ({
    id: `${tenantId}-${index}`,
    text: chunk,
    values: Array.from({ length: 10 }, (_, i) => Math.sin(chunk.length + i)),
  }));
};
