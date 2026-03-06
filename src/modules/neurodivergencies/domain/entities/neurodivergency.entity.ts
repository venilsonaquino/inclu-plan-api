export class Neurodivergency {
  id: string;
  name: string; // e.g., "TEA"
  description: string; // e.g., "Transtorno do Espectro Autista. O aluno necessita de ..."
  createdAt: Date;
  updatedAt: Date;

  constructor(props: Partial<Neurodivergency>) {
    Object.assign(this, props);
  }
}
