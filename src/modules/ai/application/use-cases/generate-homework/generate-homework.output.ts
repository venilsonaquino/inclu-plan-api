import { z } from 'zod';

export const GenerateHomeworkSchema = z.object({
  homework: z.object({
    title: z.string(),
    instructions: z.string().describe("Instruções passo-a-passo da atividade"),
    materialsNeeded: z.string().describe("Materiais necessários para a atividade em casa"),
    imagePrompt: z.string().describe("Prompt em inglês para gerar uma imagem ilustrativa")
  }),
  design: z.object({
    fontFamily: z.string(),
    primaryColor: z.string(),
    secondaryColor: z.string(),
    recommendedPrintSize: z.string()
  }).optional()
});

export interface GenerateHomeworkOutput {
  homework: {
    title: string;
    instructions: string;
    materialsNeeded: string;
    imagePrompt: string;
    generatedImage?: string;
  };
  design?: {
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
    recommendedPrintSize: string;
  };
}
