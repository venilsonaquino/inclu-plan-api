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
O usuário enviará o contexto desejado para a semana e uma lista dos alunos (nome, série/ano letivo e perfil de neurodiversidade).
Você deve gerar um planejamento semanal nivelado de acordo com as diretrizes e BNCC correspondentes à série do aluno.
REGRAS IMPORTANTES SOBRE OS DIAS E ALUNOS:
- Por padrão, gere planejamento de segunda a sexta-feira.
- EXCEÇÃO: Se o contexto do usuário indicar que algum dia específico NÃO TEM AULA ou não possui disciplinas (ex: "Sexta não tem aula"), VOCÊ DEVE OMITIR completamente este dia.
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
Atenção: Faça suposições realistas de planejamento escolar brasileiro, mas respeite rigorosamente as restrições de dias vazios.`;

  async execute(payload: GenerateLessonInput): Promise<Result<GenerateLessonOutput>> {
    try {
      const alunosStr = payload.students
        .map((s) => `- NOME: ${s.name} | SÉRIE/ANO: ${s.grade || 'Não informada'} | PERFIL: ${s.profiles.join(', ')}`)
        .join('\n');

      const promptText = `
Por favor, gere o planejamento semanal seguindo as regras do JSON e as adaptações para CADA ALUNO ABAIXO:

CONTEÚDOS POR DISCIPLINA (Foque o planejamento exatamente nessas diretrizes informadas pelo professor para cada matéria):
${payload.content}

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
