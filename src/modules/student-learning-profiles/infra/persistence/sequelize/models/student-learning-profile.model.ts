import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { StudentLearningProfile } from '@/modules/student-learning-profiles/domain/entities/student-learning-profile.entity';
import { StudentModel } from '@/modules/students/infra/persistence/sequelize/models/student.model';
import { LearningProfileModel } from '@/modules/learning-profiles/infra/persistence/sequelize/models/learning-profile.model';

@Table({
  tableName: 'student_learning_profiles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false, // matches migration where updated_at is absent
  underscored: true,
})
export class StudentLearningProfileModel extends Model<StudentLearningProfileModel> {
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

  @ForeignKey(() => LearningProfileModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare learningProfileId: string;

  @BelongsTo(() => LearningProfileModel)
  learningProfile: LearningProfileModel;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare notes: string;

  // Domain Mapping Utils
  toDomain(): StudentLearningProfile {
    return new StudentLearningProfile({
      id: this.id,
      studentId: this.studentId,
      learningProfileId: this.learningProfileId,
      notes: this.notes,
      createdAt: this.createdAt,
    });
  }
}
