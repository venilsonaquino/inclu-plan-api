export class LearningProfile {
  id: string;
  name: string; // e.g., "TEA"
  description: string; // e.g., "Transtorno do Espectro Autista. O aluno necessita de ..."
  createdAt: Date;
  updatedAt: Date;

  constructor(props: Partial<LearningProfile>) {
    Object.assign(this, props);
  }
}
