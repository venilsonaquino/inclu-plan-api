export class Teacher {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(props: Partial<Teacher>) {
    Object.assign(this, props);
  }
}
