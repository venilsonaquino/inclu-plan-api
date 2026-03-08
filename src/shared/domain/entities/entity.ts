export abstract class Entity<T> {
  protected readonly _id: string;
  public readonly props: T;
  protected readonly _created_at: Date;
  protected _updated_at: Date;
  protected _deleted_at?: Date | null;

  constructor(
    props: T,
    id?: string,
    created_at?: Date,
    updated_at?: Date,
    deleted_at?: Date | null
  ) {
    this.props = props;
    this._id = id || crypto.randomUUID();
    this._created_at = created_at || new Date();
    this._updated_at = updated_at || new Date();
    this._deleted_at = deleted_at;
  }

  get id(): string {
    return this._id;
  }

  get created_at(): Date {
    return this._created_at;
  }

  get updated_at(): Date {
    return this._updated_at;
  }

  get deleted_at(): Date | null | undefined {
    return this._deleted_at;
  }

  public equals(object?: Entity<T>): boolean {
    if (object === null || object === undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!(object instanceof Entity)) {
      return false;
    }

    return this._id === object._id;
  }
}
