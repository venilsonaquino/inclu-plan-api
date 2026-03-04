import { z } from 'zod';

export const GenerateBoardSchema = z.object({
  board: z.object({
    title: z.string().describe("Título da prancha"),
    text: z.string().describe("Texto principal da prancha"),
    imagePrompt: z.string().describe("Prompt ultra-detalhado em inglês para a imagem da prancha")
  }),
  design: z.object({
    fontFamily: z.string(),
    primaryColor: z.string(),
    secondaryColor: z.string(),
    recommendedPrintSize: z.string()
  }).optional()
});

export interface GenerateBoardOutput {
  board: {
    title: string;
    text: string;
    imagePrompt: string;
    generatedImage?: string; // Base64 added if hydrated
  };
  design?: {
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
    recommendedPrintSize: string;
  };
}
