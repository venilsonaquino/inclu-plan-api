import { Injectable, Logger } from '@nestjs/common';
import { GeminiProvider } from '@/modules/ai/infra/integrations/gemini.provider';
import { Result } from '@/shared/domain/utils/result';
import { GenerateLessonInput } from './generate-lesson.input';
import { GenerateLessonOutput } from './generate-lesson.output';

@Injectable()
export class GenerateLessonUseCase {
  private readonly logger = new Logger(GenerateLessonUseCase.name);

  constructor(private readonly geminiProvider: GeminiProvider) { }

  private readonly systemInstruction = `Você é um especialista em educação inclusiva e Universal Design for Learning (UDL), experiente em adaptação curricular.
O usuário enviará a ESTRUTURA DOS DIAS (quais dias e quais disciplinas) e os conteúdos base, além da lista dos alunos da turma.
Você deve gerar um planejamento de aula nivelado de acordo com as diretrizes e BNCC correspondentes à série do aluno.

REGRAS OBRIGATÓRIAS SOBRE OS DIAS DA SEMANA (CUIDADO COM ALUCINAÇÕES):
- GERE ATIVIDADES APENAS E EXCLUSIVAMENTE PARA OS DIAS SOLICITADOS NO CONTEXTO.
- Não presuma que a semana deve ter todos os dias. Se o professor enviou instruções APENAS para "Segunda-feira", o seu JSON final deverá conter APENAS a "Segunda-feira" no array de "dias".
- É EXTREMAMENTE PROIBIDO inventar/criar dias da semana que o usuário não preencheu.

REGRAS OBRIGATÓRIAS SOBRE OS ALUNOS E ADAPTAÇÕES:
- Para cada dia válido e matéria, crie atividades. 
- Para CADA ALUNO na lista, gere UMA ÚNICA adaptação na atividade. Se o aluno possuir múltiplos perfis (ex: TEA e TDAH), combine as estratégias em um único bloco de adaptação. NUNCA duplique a atividade ou crie duas adaptações separadas para a mesma pessoa.

Sua resposta DEVE OBRIGATORIAMENTE ser um JSON válido, correspondendo estritamente à seguinte estrutura:
{
  "dias": [
    {
      "dia": "Segunda-feira",
      "materias": [
        {
          "nome": "string (ex: Português)",
          "atividades": [
            {
              "objetivo": "string",
              "bncc": {
                "codigo": "string (ex: EF15LP01)",
                "descricao": "string (Descrição fiel à BNCC)"
              },
              "descricao": "string",
              "recursos": "string",
              "avaliacao": "string",
              "adaptacoes": [
                {
                  "aluno": "string (Nome explícito do aluno da lista enviada)",
                  "perfil": "string (ex: TEA e TDAH)",
                  "adaptacao": "string (Como a atividade será ajustada mesclando as necessidades deste perfil múltiplo)"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
Atenção: Respeite rigorosamente a restrição de dias exigidos. Não alucine dias vazios.`;

  async execute(payload: GenerateLessonInput): Promise<Result<GenerateLessonOutput>> {
    try {
      const alunosStr = payload.students
        .map((s) => `- NOME: ${s.name} | SÉRIE/ANO: ${s.grade || 'Não informada'} | PERFIL: ${s.profiles.join(', ')}`)
        .join('\n');

      let contentsStr = '';
      if (payload.days && payload.days.length > 0) {
        payload.days.forEach(d => {
          contentsStr += `[${d.day}]\n`;
          d.disciplines.forEach(disc => {
            contentsStr += `  - ${disc.name} (Tema: ${disc.theme})`;
            if (disc.observations) {
              contentsStr += ` | Observações: ${disc.observations}`;
            }
            contentsStr += '\n';
          });
          contentsStr += '\n';
        });
      }

      const promptText = `
Por favor, gere o planejamento semanal seguindo as regras do JSON e as adaptações para CADA ALUNO ABAIXO:

CONTEÚDOS POR DISCIPLINA (Foque o planejamento exatamente nessas diretrizes informadas pelo professor para cada dia e matéria):
${contentsStr}

ALUNOS CADASTRADOS NA TURMA (GERE ADAPTAÇÕES NOMINAIS EM TODAS AS ATIVIDADES):
${alunosStr}
`;

      const aiResponse = await this.geminiProvider.generateText(this.systemInstruction, promptText, payload.imagePart);
      return Result.ok<GenerateLessonOutput>(aiResponse);
    } catch (error) {
      this.logger.error('Failed to generate lesson', error);
      return Result.fail<GenerateLessonOutput>(error instanceof Error ? error.message : 'Unknown error generating lesson');
    }
  }
}
