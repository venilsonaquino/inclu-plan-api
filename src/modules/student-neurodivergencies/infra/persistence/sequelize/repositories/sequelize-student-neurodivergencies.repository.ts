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
  ) { }

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
    return models.map((m) => new StudentNeurodivergency(m.get({ plain: true })));
  }

  async findByNeurodivergencyId(neurodivergencyId: string): Promise<StudentNeurodivergency[]> {
    const models = await this.model.findAll({
      where: { neurodivergencyId },
    });
    return models.map((m) => new StudentNeurodivergency(m.get({ plain: true })));
  }

  async remove(studentId: string, neurodivergencyId: string): Promise<void> {
    await this.model.destroy({
      where: {
        studentId,
        neurodivergencyId,
      },
    });
  }
}
