import { Table, Column, Model, DataType, IsUUID, HasMany } from 'sequelize-typescript';
import { StudentAdaptationModel } from './student-adaptation.model';

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

  @Column({ type: DataType.STRING, allowNull: false })
  declare discipline: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare theme: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare lessonTitle: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare estimatedPrepTime: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare lessonNumber: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare objective: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare learningObjects: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare bnccCode: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare bnccDescription: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare duration: string;

  @Column({ type: DataType.JSONB, allowNull: true })
  declare activitySteps: string[];

  @Column({ type: DataType.TEXT, allowNull: true })
  declare udlRepresentation: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare udlActionExpression: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare udlEngagement: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare resources: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare evaluation: string;

  @HasMany(() => StudentAdaptationModel)
  declare studentAdaptations: StudentAdaptationModel[];
}
