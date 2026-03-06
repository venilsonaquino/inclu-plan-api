interface DisciplineProps {
  name: string;
  theme: string;
  observations?: string;
}

interface DayProps {
  day: string;
  disciplines: DisciplineProps[];
}

export class LessonSchedule {
  private readonly _days: DayProps[];

  constructor(days: DayProps[]) {
    this._days = days || [];
  }

  static create(days: DayProps[]): LessonSchedule {
    return new LessonSchedule(days);
  }

  get days(): DayProps[] {
    return this._days;
  }

  toPromptString(): string {
    if (this._days.length === 0) return '';
    return this._days
      .map(
        d =>
          `[${d.day}]\n` +
          d.disciplines
            .map(disc => {
              const obs = disc.observations ? ` | Observações: ${disc.observations}` : '';
              return `  - ${disc.name} (Tema: ${disc.theme})${obs}\n`;
            })
            .join('') +
          '\n',
      )
      .join('');
  }
}
