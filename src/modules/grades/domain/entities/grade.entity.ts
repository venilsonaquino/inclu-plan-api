import { Entity } from '@/shared/domain/entities/entity';

export interface GradeProps {
  name: string;
  description?: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Grade extends Entity<GradeProps> {
  constructor(props: Partial<GradeProps>, id?: string) {
    super(
      {
        name: props.name ?? '',
        description: props.description,
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
