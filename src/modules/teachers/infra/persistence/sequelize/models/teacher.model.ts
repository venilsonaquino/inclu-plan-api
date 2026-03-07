import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { Teacher } from '@/modules/teachers/domain/entities/teacher.entity';

@Table({
  tableName: 'teachers',
  timestamps: true,
  underscored: true,
  paranoid: true, // handles deleted_at
})
export class TeacherModel extends Model<TeacherModel> {
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
  toDomain(): Teacher {
    return new Teacher({
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
