import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IStudentNeurodivergenciesRepository } from '@/modules/student-neurodivergencies/domain/repositories/student-neurodivergencies.repository';
import { StudentNeurodivergency } from '@/modules/student-neurodivergencies/domain/entities/student-neurodivergency.entity';
import { StudentNeurodivergencyModel } from '@/modules/student-neurodivergencies/infra/persistence/sequelize/models/student-neurodivergency.model';

@Injectable()
export class SequelizeStudentNeurodivergenciesRepository implements IStudentNeurodivergenciesRepository {
  constructor(
    @InjectModel(StudentNeurodivergencyModel)
    private readonly model: typeof StudentNeurodivergencyModel,
  ) {}

  async assign(association: StudentNeurodivergency): Promise<void> {
    await this.model.create({
      id: association.id,
      studentId: association.studentId,
      neurodivergencyId: association.neurodivergencyId,
      notes: association.notes,
      createdAt: association.createdAt,
    });
  }

  async findByStudentId(studentId: string): Promise<StudentNeurodivergency[]> {
    const models = await this.model.findAll({
      where: { studentId },
    });
    return models.map(m => this.toDomain(m));
  }

  async findByNeurodivergencyId(neurodivergencyId: string): Promise<StudentNeurodivergency[]> {
    const models = await this.model.findAll({
      where: { neurodivergencyId },
    });
    return models.map(m => this.toDomain(m));
  }

  async remove(studentId: string, neurodivergencyId: string): Promise<void> {
    await this.model.destroy({
      where: {
        studentId,
        neurodivergencyId,
      },
    });
  }

  private toDomain(model: StudentNeurodivergencyModel): StudentNeurodivergency {
    const plain = model.get({ plain: true }) as any;
    return new StudentNeurodivergency({
      ...plain,
      createdAt: plain.created_at,
    });
  }
}
