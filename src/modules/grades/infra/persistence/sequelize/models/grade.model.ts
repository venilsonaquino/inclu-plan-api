import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { Grade } from '@/modules/grades/domain/entities/grade.entity';

@Table({
  tableName: 'grades',
  timestamps: true,
  underscored: true,
})
export class GradeModel extends Model<GradeModel> {
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
    allowNull: true,
  })
  declare description: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare position: number;

  // Domain Mapping Utils
  toDomain(): Grade {
    return new Grade(
      {
        name: this.name,
        description: this.description,
        position: this.position,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      },
      this.id,
    );
  }
}
