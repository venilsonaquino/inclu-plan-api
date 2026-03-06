import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import { LearningProfile } from '@/modules/learning-profiles/domain/entities/learning-profile.entity';
import { StudentModel } from '@/modules/students/infra/persistence/sequelize/models/student.model';
import { StudentLearningProfileModel } from '@/modules/student-learning-profiles/infra/persistence/sequelize/models/student-learning-profile.model';

@Table({
  tableName: 'learning_profiles',
  timestamps: true,
  underscored: true,
})
export class LearningProfileModel extends Model<LearningProfileModel> {
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

  @BelongsToMany(() => StudentModel, () => StudentLearningProfileModel)
  students: StudentModel[];

  // Domain Mapping Utils
  toDomain(): LearningProfile {
    return new LearningProfile({
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
