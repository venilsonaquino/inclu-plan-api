interface StudentProps {
  name: string;
  grade?: string;
  profiles: string[];
}

export class LessonStudents {
  private readonly _students: StudentProps[];

  constructor(students: StudentProps[]) {
    if (!students || students.length === 0) {
      throw new Error('LessonStudents must have at least one student.');
    }
    this._students = students;
  }

  static create(students: StudentProps[]): LessonStudents {
    return new LessonStudents(students);
  }

  get students(): StudentProps[] {
    return this._students;
  }

  toPromptString(): string {
    return this._students
      .map(
        (s) =>
          `- NOME: ${s.name} | SÉRIE/ANO: ${s.grade || 'Não informada'} | PERFIL: ${s.profiles.join(', ')}`,
      )
      .join('\n');
  }
}
