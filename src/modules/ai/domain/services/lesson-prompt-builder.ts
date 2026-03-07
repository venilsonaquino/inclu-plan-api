import { Student } from '@/modules/students/domain/entities/student.entity';

export class LessonPromptBuilder {
  static buildStudentProfiles(
    students: Student[],
    gradeMap: Map<string, string>,
    neuroMap: Map<string, string>,
  ): string {
    return students
      .map(s => {
        const gradeName = gradeMap.get(s.gradeId) || 'Não informada';
        const studentNeurosArr = s.neurodivergencies
          .map(nId => neuroMap.get(nId))
          .filter(Boolean);
        const neurosString = studentNeurosArr.join(', ') || 'Sem neurodivergência especificada';

        const notesString = s.notes ? `\n- NOTAS: ${s.notes}` : '';

        return `[PERFIL DE ALUNO]\n- NOME: ${s.name}\n- SÉRIE: ${gradeName}\n- NEURODIVERGÊNCIAS: ${neurosString}${notesString}`;
      })
      .join('\n\n');
  }

  static buildLessonContext(discipline: string, theme: string, observations?: string): string {
    return `- Disciplina: ${discipline}\n- Tema: ${theme}\n- Observações: ${observations || 'Nenhuma'}`;
  }

  static buildBatchPrompt(
    lessons: { discipline: string; theme: string; observations?: string; students: Student[] }[],
    gradeMap: Map<string, string>,
    neuroMap: Map<string, string>,
  ): string {
    return lessons
      .map((l, index) => {
        const header = `### LIÇÃO ${index + 1}: ${l.discipline} - ${l.theme} ###`;
        const obs = l.observations ? `\nObservações: ${l.observations}` : '';
        const students = this.buildStudentProfiles(l.students, gradeMap, neuroMap);
        return `${header}${obs}\n\n${students}`;
      })
      .join('\n\n---\n\n');
  }
}
