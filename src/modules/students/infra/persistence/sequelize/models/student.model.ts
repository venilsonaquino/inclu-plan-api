import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import { Student } from '@/modules/students/domain/entities/student.entity';
import { NeurodivergencyModel } from '@/modules/neurodivergencies/infra/persistence/sequelize/models/neurodivergency.model';
import { StudentNeurodivergencyModel } from '@/modules/student-neurodivergencies/infra/persistence/sequelize/models/student-neurodivergency.model';

@Table({
  tableName: 'students',
  timestamps: true,
  underscored: true,
  paranoid: true, // handles deleted_at
})
export class StudentModel extends Model<StudentModel> {
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
  declare gradeId: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare schoolClassId: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare notes: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isActive: boolean;

  @BelongsToMany(() => NeurodivergencyModel, () => StudentNeurodivergencyModel)
  neurodivergencies: NeurodivergencyModel[];

  // Domain Mapping Utils
  toDomain(): Student {
    return new Student({
      name: this.name,
      gradeId: this.gradeId,
      neurodivergencies: this.neurodivergencies ? this.neurodivergencies.map(p => p.id) : [],
      schoolClassId: this.schoolClassId,
      notes: this.notes,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    }, this.id);
  }
}
