export interface GenerateLessonOutput {
  dias: Array<{
    dia: string;
    materias: Array<{
      nome: string;
      atividades: Array<{
        objetivo: string;
        bncc: {
          codigo: string;
          descricao: string;
        };
        descricao: string;
        recursos: string;
        avaliacao: string;
        adaptacoes: Array<{
          aluno: string;
          perfil: string;
          adaptacao: string;
        }>;
      }>;
    }>;
  }>;
}
