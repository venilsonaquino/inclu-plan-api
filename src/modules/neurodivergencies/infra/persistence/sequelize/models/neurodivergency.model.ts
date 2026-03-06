import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import { Neurodivergency } from '@/modules/neurodivergencies/domain/entities/neurodivergency.entity';
import { StudentModel } from '@/modules/students/infra/persistence/sequelize/models/student.model';
import { StudentNeurodivergencyModel } from '@/modules/student-neurodivergencies/infra/persistence/sequelize/models/student-neurodivergency.model';

@Table({
  tableName: 'neurodivergencies',
  timestamps: true,
  underscored: true,
})
export class NeurodivergencyModel extends Model<NeurodivergencyModel> {
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
    type: DataType.TEXT,
    allowNull: false,
  })
  declare description: string;

  @BelongsToMany(() => StudentModel, () => StudentNeurodivergencyModel)
  students: StudentModel[];

  // Domain Mapping Utils
  toDomain(): Neurodivergency {
    return new Neurodivergency({
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
