import { Result } from '@/shared/domain/utils/result';

interface StudentProps {
  name: string;
  grade?: string;
  neurodivergencies: string[];
}

export class LessonStudents {
  private readonly _students: StudentProps[];

  private constructor(students: StudentProps[]) {
    this._students = students;
  }

  static create(students: StudentProps[]): Result<LessonStudents> {
    if (!students || students.length === 0) {
      return Result.fail<LessonStudents>('LessonStudents must have at least one student.');
    }
    return Result.ok<LessonStudents>(new LessonStudents(students));
  }

  get students(): StudentProps[] {
    return this._students;
  }

  toPromptString(): string {
    return this._students
      .map(
        s =>
          `- NOME: ${s.name} | SÉRIE/ANO: ${s.grade || 'Não informada'} | NEURODIVERGÊNCIA: ${s.neurodivergencies.join(', ')}`,
      )
      .join('\n');
  }
}
