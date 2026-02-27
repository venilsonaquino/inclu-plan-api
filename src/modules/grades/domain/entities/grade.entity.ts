export class Grade {
  id: string;
  name: string; // e.g., "3º Ano", "Ensino Fundamental II", "Educação Infantil"
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: Partial<Grade>) {
    Object.assign(this, props);
  }
}
