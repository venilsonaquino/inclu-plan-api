import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IStudentsRepository } from '@/modules/students/domain/repositories/students.repository';
import { Student } from '@/modules/students/domain/entities/student.entity';
import { Sequelize } from 'sequelize-typescript';
import { StudentModel } from '@/modules/students/infra/persistence/sequelize/models/student.model';
import { NeurodivergencyModel } from '@/modules/neurodivergencies/infra/persistence/sequelize/models/neurodivergency.model';
import { StudentNeurodivergencyModel } from '@/modules/student-neurodivergencies/infra/persistence/sequelize/models/student-neurodivergency.model';

@Injectable()
export class SequelizeStudentsRepository implements IStudentsRepository {
  constructor(
    @InjectModel(StudentModel)
    private readonly studentModel: typeof StudentModel,
    @InjectModel(NeurodivergencyModel)
    private readonly neurodivergencyModel: typeof NeurodivergencyModel,
    @InjectModel(StudentNeurodivergencyModel)
    private readonly pivotModel: typeof StudentNeurodivergencyModel,
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

      if (student.neurodivergencies && student.neurodivergencies.length > 0) {
        // Create associations directly using provided IDs
        const associations = student.neurodivergencies.map((id) => ({
          studentId: student.id,
          neurodivergencyId: id,
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
      include: [NeurodivergencyModel],
    });
    if (!model) return null;
    return model.toDomain();
  }

  async findByClassId(schoolClassId: string): Promise<Student[]> {
    const models = await this.studentModel.findAll({
      where: { schoolClassId },
      include: [NeurodivergencyModel],
    });
    return models.map((model) => model.toDomain());
  }
}
