import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { SchoolClass } from '@/modules/school-classes/domain/entities/school-class.entity';

@Table({
  tableName: 'school_classes',
  timestamps: true,
  underscored: true,
  paranoid: true, // handles deleted_at
})
export class SchoolClassModel extends Model<SchoolClassModel> {
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
    type: DataType.UUID,
    allowNull: false,
  })
  declare teacherId: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isActive: boolean;

  // Domain Mapping Utils
  toDomain(): SchoolClass {
    return new SchoolClass({
      name: this.name,
      teacherId: this.teacherId,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    }, this.id);
  }
}
