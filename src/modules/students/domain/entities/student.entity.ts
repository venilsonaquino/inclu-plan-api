export class Student {
  id: string;
  name: string;
  grade: string;
  profiles: string[];
  schoolClassId?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(props: Partial<Student>) {
    Object.assign(this, props);
    // defaults
    if (this.isActive === undefined) this.isActive = true;
    if (!this.profiles) this.profiles = [];
  }
}
