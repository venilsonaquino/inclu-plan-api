import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IGradesRepository } from '@/modules/grades/domain/repositories/grades.repository';
import { Grade } from '@/modules/grades/domain/entities/grade.entity';
import { GradeModel } from '@/modules/grades/infra/persistence/sequelize/models/grade.model';

@Injectable()
export class SequelizeGradesRepository implements IGradesRepository {
  constructor(
    @InjectModel(GradeModel)
    private readonly gradeModel: typeof GradeModel,
  ) { }

  async create(grade: Grade): Promise<void> {
    await this.gradeModel.create({
      id: grade.id,
      name: grade.name,
      description: grade.description,
      createdAt: grade.createdAt,
      updatedAt: grade.updatedAt,
    });
  }

  async findById(id: string): Promise<Grade | null> {
    const model = await this.gradeModel.findByPk(id);
    if (!model) return null;
    return model.toDomain();
  }

  async findAll(): Promise<Grade[]> {
    const models = await this.gradeModel.findAll();
    return models.map((model) => model.toDomain());
  }

  async findByName(name: string): Promise<Grade | null> {
    const model = await this.gradeModel.findOne({ where: { name } });
    if (!model) return null;
    return model.toDomain();
  }
}
