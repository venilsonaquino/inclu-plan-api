import { z } from 'zod';

export const GenerateCardsSchema = z.object({
  cards: z.array(z.object({
    title: z.string().describe("Título do cartão (ex: Sol)"),
    text: z.string().describe("Texto explicativo ou de apoio"),
    imagePrompt: z.string().describe("Prompt em inglês ultra-detalhado para geração de imagem realista")
  })),
  design: z.object({
    fontFamily: z.string(),
    primaryColor: z.string(),
    secondaryColor: z.string(),
    recommendedPrintSize: z.string()
  }).optional(),
  tips: z.array(z.string()).optional().describe("Dicas rápidas para o professor de como usar os cartões")
});

export interface GenerateCardsOutput {
  cards: Array<{
    title: string;
    text: string;
    imagePrompt: string;
    generatedImage?: string; // In case we decide to hydrate it immediately
  }>;
  design?: {
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
    recommendedPrintSize: string;
  };
  tips?: Array<string>;
}
