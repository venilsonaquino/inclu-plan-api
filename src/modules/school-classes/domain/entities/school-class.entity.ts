export class SchoolClass {
  id: string;
  name: string; // e.g., "3º Ano B"
  teacherId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(props: Partial<SchoolClass>) {
    Object.assign(this, props);
    // conventions for new instances
    if (this.isActive === undefined) this.isActive = true;
  }
}
