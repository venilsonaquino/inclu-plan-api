import { Table, Column, Model, DataType, IsUUID } from 'sequelize-typescript';

@Table({
  tableName: 'lesson_plans',
  timestamps: true,
  underscored: true,
})
export class LessonPlanModel extends Model<LessonPlanModel> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  declare id: string;

  @IsUUID(4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare teacherId: string;

  @IsUUID(4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare studentId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare discipline: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare theme: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare objective: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare bnccCode: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare bnccDescription: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare description: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare resources: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare evaluation: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare adaptation: string;
}
