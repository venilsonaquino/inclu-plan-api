import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IStudentsRepository } from '@/modules/students/domain/repositories/students.repository';
import { Student } from '@/modules/students/domain/entities/student.entity';
import { Sequelize } from 'sequelize-typescript';
import { StudentModel } from '@/modules/students/infra/persistence/sequelize/models/student.model';
import { LearningProfileModel } from '@/modules/learning-profiles/infra/persistence/sequelize/models/learning-profile.model';
import { StudentLearningProfileModel } from '@/modules/student-learning-profiles/infra/persistence/sequelize/models/student-learning-profile.model';

@Injectable()
export class SequelizeStudentsRepository implements IStudentsRepository {
  constructor(
    @InjectModel(StudentModel)
    private readonly studentModel: typeof StudentModel,
    @InjectModel(LearningProfileModel)
    private readonly learningProfileModel: typeof LearningProfileModel,
    @InjectModel(StudentLearningProfileModel)
    private readonly pivotModel: typeof StudentLearningProfileModel,
    private readonly sequelize: Sequelize,
  ) { }

  async create(student: Student): Promise<void> {
    const transaction = await this.sequelize.transaction();
    try {
      await this.studentModel.create(
        {
          id: student.id,
          name: student.name,
          gradeId: student.gradeId,
          schoolClassId: student.schoolClassId,
          notes: student.notes,
          isActive: student.isActive,
          createdAt: student.createdAt,
          updatedAt: student.updatedAt,
        },
        { transaction },
      );

      if (student.profiles && student.profiles.length > 0) {
        // Find profile IDs by name
        const profiles = await this.learningProfileModel.findAll({
          where: { name: student.profiles },
          transaction,
        });

        // Create associations
        const associations = profiles.map((p) => ({
          studentId: student.id,
          learningProfileId: p.id,
          notes: 'Auto-linked on student creation',
        }));

        await this.pivotModel.bulkCreate(associations as any, { transaction });
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findById(id: string): Promise<Student | null> {
    const model = await this.studentModel.findByPk(id, {
      include: [LearningProfileModel],
    });
    if (!model) return null;
    return model.toDomain();
  }

  async findByClassId(schoolClassId: string): Promise<Student[]> {
    const models = await this.studentModel.findAll({
      where: { schoolClassId },
      include: [LearningProfileModel],
    });
    return models.map((model) => model.toDomain());
  }
}
