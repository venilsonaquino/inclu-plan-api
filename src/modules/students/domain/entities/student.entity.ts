import { Entity } from '@/shared/domain/entities/entity';

export interface StudentProps {
  name: string;
  gradeId: string;
  neurodivergencies: string[];
  neurodivergencyDetails?: { id: string; name: string }[];
  schoolClassId?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export class Student extends Entity<StudentProps> {
  constructor(props: Partial<StudentProps>, id?: string) {
    super(
      {
        name: props.name ?? '',
        gradeId: props.gradeId ?? '',
        neurodivergencies: props.neurodivergencies ?? [],
        neurodivergencyDetails: props.neurodivergencyDetails,
        schoolClassId: props.schoolClassId,
        notes: props.notes,
        isActive: props.isActive ?? true,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
        deletedAt: props.deletedAt,
      },
      id,
    );
  }

  get name() {
    return this.props.name;
  }
  get gradeId() {
    return this.props.gradeId;
  }
  get neurodivergencies() {
    return this.props.neurodivergencies;
  }
  get neurodivergencyDetails() {
    return this.props.neurodivergencyDetails;
  }
  get schoolClassId() {
    return this.props.schoolClassId;
  }
  get notes() {
    return this.props.notes;
  }
  get isActive() {
    return this.props.isActive;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get deletedAt() {
    return this.props.deletedAt;
  }
}
