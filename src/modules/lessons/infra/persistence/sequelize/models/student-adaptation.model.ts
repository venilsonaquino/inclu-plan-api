import { Table, Column, Model, DataType, IsUUID, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { LessonPlanModel } from './lesson-plan.model';

@Table({
  tableName: 'student_adaptations',
  timestamps: true,
  underscored: true,
})
export class StudentAdaptationModel extends Model<StudentAdaptationModel> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  declare id: string;

  @ForeignKey(() => LessonPlanModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare lessonPlanId: string;

  @IsUUID(4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare studentId: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare studentName: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare studentGrade: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare studentNeurodivergencies: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare strategy: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare behavioralTips: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare supportLevel: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare successIndicators: string;

  @BelongsTo(() => LessonPlanModel)
  declare lessonPlan: LessonPlanModel;
}
