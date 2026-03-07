import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { StudentModel } from '@/modules/students/infra/persistence/sequelize/models/student.model';
import { NeurodivergencyModel } from '@/modules/neurodivergencies/infra/persistence/sequelize/models/neurodivergency.model';

@Table({
  tableName: 'student_neurodivergencies',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  underscored: true,
})
export class StudentNeurodivergencyModel extends Model<StudentNeurodivergencyModel> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  declare id: string;

  @ForeignKey(() => StudentModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare studentId: string;

  @BelongsTo(() => StudentModel)
  student: StudentModel;

  @ForeignKey(() => NeurodivergencyModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare neurodivergencyId: string;

  @BelongsTo(() => NeurodivergencyModel)
  neurodivergency: NeurodivergencyModel;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare notes: string;
}
