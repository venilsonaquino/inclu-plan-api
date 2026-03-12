import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { User } from '@/modules/identity/domain/entities/user.entity';

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
  paranoid: true, // handles deleted_at
})
export class UserModel extends Model<UserModel> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare passwordHash: string;

  // Domain Mapping Utils
  toDomain(): User {
    return new User({
      id: this.id,
      name: this.name,
      email: this.email,
      passwordHash: this.passwordHash,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    });
  }
}
