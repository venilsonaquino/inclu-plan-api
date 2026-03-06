import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import { Student } from '@/modules/students/domain/entities/student.entity';
import { LearningProfileModel } from '@/modules/learning-profiles/infra/persistence/sequelize/models/learning-profile.model';
import { StudentLearningProfileModel } from '@/modules/student-learning-profiles/infra/persistence/sequelize/models/student-learning-profile.model';

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

  @BelongsToMany(() => LearningProfileModel, () => StudentLearningProfileModel)
  learningProfiles: LearningProfileModel[];

  // Domain Mapping Utils
  toDomain(): Student {
    // Note: The 'profiles' array will require a relationship mapping when reading from DB.
    // For now, based on the basic `student` table data, we map what we have.
    return new Student({
      id: this.id,
      name: this.name,
      gradeId: this.gradeId,
      profiles: this.learningProfiles ? this.learningProfiles.map(p => p.name) : [],
      schoolClassId: this.schoolClassId,
      notes: this.notes,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    });
  }
}
