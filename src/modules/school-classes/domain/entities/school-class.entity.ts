import { Entity } from '@/shared/domain/entities/entity';

export interface SchoolClassProps {
  name: string;
  teacherId: string;
  isActive: boolean;
  students?: any[]; // We will type this as any[] or Student[] if we import Student
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export class SchoolClass extends Entity<SchoolClassProps> {
  constructor(props: Partial<SchoolClassProps>, id?: string) {
    super(
      {
        name: props.name ?? '',
        teacherId: props.teacherId ?? '',
        isActive: props.isActive ?? true,
        students: props.students ?? [],
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
  get teacherId() {
    return this.props.teacherId;
  }
  get isActive() {
    return this.props.isActive;
  }
  get students() {
    return this.props.students;
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

