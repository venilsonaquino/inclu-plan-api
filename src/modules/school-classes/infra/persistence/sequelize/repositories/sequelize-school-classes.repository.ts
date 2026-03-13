import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ISchoolClassesRepository } from '@/modules/school-classes/domain/repositories/school-classes.repository';
import { SchoolClass } from '@/modules/school-classes/domain/entities/school-class.entity';
import { SchoolClassModel } from '@/modules/school-classes/infra/persistence/sequelize/models/school-class.model';
import { StudentModel } from '@/modules/students/infra/persistence/sequelize/models/student.model';

@Injectable()
export class SequelizeSchoolClassesRepository implements ISchoolClassesRepository {
  constructor(
    @InjectModel(SchoolClassModel)
    private readonly schoolClassModel: typeof SchoolClassModel,
  ) {}

  async create(schoolClass: SchoolClass): Promise<void> {
    await this.schoolClassModel.create({
      id: schoolClass.id,
      name: schoolClass.name,
      teacherId: schoolClass.teacherId,
      isActive: schoolClass.isActive,
      createdAt: schoolClass.createdAt,
      updatedAt: schoolClass.updatedAt,
    });
  }

  async findById(id: string): Promise<SchoolClass | null> {
    const model = await this.schoolClassModel.findByPk(id, {
      include: [
        {
          model: StudentModel,
          required: false,
        },
      ],
    });
    if (!model) return null;
    return model.toDomain();
  }

  async findByTeacherId(teacherId: string): Promise<SchoolClass[]> {
    const models = await this.schoolClassModel.findAll({
      where: { teacherId },
      include: [
        {
          model: StudentModel,
          required: false,
        },
      ],
    });
    return models.map(model => model.toDomain());
  }
}
