import { Injectable, Logger } from '@nestjs/common';
import { GeminiProvider } from '@/modules/ai/infra/integrations/gemini.provider';
import { Result } from '@/shared/domain/utils/result';
import { GenerateMaterialInput } from './generate-material.input';
import { GenerateMaterialOutput } from './generate-material.output';

@Injectable()
export class GenerateMaterialUseCase {
  private readonly logger = new Logger(GenerateMaterialUseCase.name);

  constructor(private readonly geminiProvider: GeminiProvider) { }

  private readonly materialInstruction = `Geração Estruturada de Material Pedagógico com Suporte a Imagem

A resposta deve retornar exclusivamente JSON válido.
Não incluir comentários, explicações, texto fora do JSON ou blocos de markdown.

Objetivo:
Gerar material pedagógico individual baseado na aula fornecida e no perfil do aluno.

Regras obrigatórias:
A resposta deve conter apenas a seguinte estrutura:

{
  "cards": [
    {
      "title": "",
      "text": "",
      "imagePrompt": ""
    }
  ],
  "board": {
    "title": "",
    "text": "",
    "imagePrompt": ""
  },
  "design": {
    "fontFamily": "",
    "primaryColor": "",
    "secondaryColor": "",
    "recommendedPrintSize": ""
  },
  "tips": [
    "",
    "",
    ""
  ]
}

O array "tips" deve:
- Conter exatamente 3 dicas cruciais e rápidas (max 1 linha cada) para o professor aplicar este material com sucesso.
- Ser extremamente focado e direcionado para o Perfil Neurodivergente do aluno e suas dificuldades específicas.

O array "cards" agora atua como um Gerador de Prancha/Flashcards de Conceitos:
- Você DEVE abstrair os conceitos principais da atividade e gerar entre 4 a 8 "cards" distintos.
- Exemplo: Numa aula sobre o Sistema Solar, gere um card para "Sol", um para "Terra", um para "Órbita", etc.
- O "title" deve ser o Rótulo em Português (ex: "Planeta Terra").
- O "text" pode ser uma explicação curtíssima ou instrução do conceito (Max 2 linhas).
- Ter imagePrompt em inglês OBRIGATÓRIAMENTE.
- O imagePrompt deve ser descritivo, focando APENAS no objeto daquele card específico.
- O imagePrompt deve incluir obrigatoriamente: simple flat illustration, neutral background, soft pastel colors, minimal details, child educational style

O campo "board" deve:
- Representar uma prancha de escolha visual GERAL da atividade.
- Ter um único imagePrompt descritivo em inglês englobando todo o cenário/tema.
- Incluir layout claro e organizado.

O campo "design" deve:
- Sugerir fonte apropriada para material infantil
- Sugerir paleta acessível
- Sugerir tamanho de impressão (ex: A5 horizontal)

Não escrever narrativa direta ao aluno.
Não incluir instruções ao professor.
Não incluir texto explicativo fora do JSON.
Não usar markdown.
Não usar emojis.

O JSON deve ser válido e parseável.
Se a resposta não estiver exatamente nesse formato, ela será considerada inválida.`;

  async execute(payload: GenerateMaterialInput): Promise<Result<GenerateMaterialOutput>> {
    try {
      const promptText = `
Contexto da Atividade Original Planejada:
${payload.activityText}

DADOS DO ALUNO ALVO:
Nome: ${payload.studentData.name}
Perfil Neurodivergente: ${payload.studentData.profile}

Crie o material pedagógico exclusivo para este aluno, baseando-se na atividade original.`;

      // 1. Generate text and prompts
      let materialData = await this.geminiProvider.generateText(this.materialInstruction, promptText);

      // Clean potential markdown blocks
      if (typeof materialData === 'string') {
        try {
          const cleanedStr = materialData.replace(/^\s*```json\s*/, '').replace(/\s*```\s*$/, '').trim();
          materialData = JSON.parse(cleanedStr);
        } catch (e) {
          this.logger.error("JSON parse error after generation", e);
          throw new Error("Invalid format received from AI.");
        }
      }

      // 2. Fetch images in parallel
      const imagePromises: Promise<void>[] = [];

      // Ensure array exists
      if (materialData.cards && Array.isArray(materialData.cards)) {
        for (const card of materialData.cards) {
          if (card.imagePrompt) {
            const p = this.geminiProvider.generateImage(card.imagePrompt)
              .then(base64 => { card.generatedImage = base64; })
              .catch(e => { this.logger.warn(`Card image failed: ${e.message}`); });
            imagePromises.push(p);
          }
        }
      }

      if (materialData.board && materialData.board.imagePrompt) {
        const p = this.geminiProvider.generateImage(materialData.board.imagePrompt)
          .then(base64 => { materialData.board.generatedImage = base64; })
          .catch(e => { this.logger.warn(`Board image failed: ${e.message}`); });
        imagePromises.push(p);
      }

      // Await all parallel generation calls
      await Promise.all(imagePromises);

      return Result.ok<GenerateMaterialOutput>(materialData);
    } catch (error) {
      this.logger.error('Failed to generate material', error);
      return Result.fail<GenerateMaterialOutput>(error instanceof Error ? error.message : 'Unknown error generating material');
    }
  }
}
