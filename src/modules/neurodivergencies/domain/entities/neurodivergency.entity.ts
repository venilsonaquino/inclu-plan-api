import { Entity } from '@/shared/domain/entities/entity';

export interface NeurodivergencyProps {
  name: string;
  description: string;
  icon: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Neurodivergency extends Entity<NeurodivergencyProps> {
  constructor(props: Partial<NeurodivergencyProps>, id?: string) {
    super(
      {
        name: props.name ?? '',
        description: props.description ?? '',
        icon: props.icon ?? '',
        position: props.position ?? 0,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }

  get name() {
    return this.props.name;
  }
  get description() {
    return this.props.description;
  }
  get icon() {
    return this.props.icon;
  }
  get position() {
    return this.props.position;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
}
