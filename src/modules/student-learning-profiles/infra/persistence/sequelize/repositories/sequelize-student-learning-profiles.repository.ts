import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IStudentLearningProfilesRepository } from '@/modules/student-learning-profiles/domain/repositories/student-learning-profiles.repository';
import { StudentLearningProfile } from '@/modules/student-learning-profiles/domain/entities/student-learning-profile.entity';
import { StudentLearningProfileModel } from '@/modules/student-learning-profiles/infra/persistence/sequelize/models/student-learning-profile.model';

@Injectable()
export class SequelizeStudentLearningProfilesRepository implements IStudentLearningProfilesRepository {
  constructor(
    @InjectModel(StudentLearningProfileModel)
    private readonly model: typeof StudentLearningProfileModel,
  ) {}

  async assign(profileAssociation: StudentLearningProfile): Promise<void> {
    await this.model.create({
      id: profileAssociation.id,
      studentId: profileAssociation.studentId,
      learningProfileId: profileAssociation.learningProfileId,
      notes: profileAssociation.notes,
      createdAt: profileAssociation.createdAt,
    });
  }

  async findByStudentId(studentId: string): Promise<StudentLearningProfile[]> {
    const models = await this.model.findAll({
      where: { studentId },
    });
    return models.map(m => m.toDomain());
  }

  async findByProfileId(learningProfileId: string): Promise<StudentLearningProfile[]> {
    const models = await this.model.findAll({
      where: { learningProfileId },
    });
    return models.map(m => m.toDomain());
  }

  async remove(studentId: string, learningProfileId: string): Promise<void> {
    await this.model.destroy({
      where: {
        studentId,
        learningProfileId,
      },
    });
  }
}
