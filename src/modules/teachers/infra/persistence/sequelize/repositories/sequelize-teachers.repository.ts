import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ITeachersRepository } from '@/modules/teachers/domain/repositories/teachers.repository';
import { Teacher } from '@/modules/teachers/domain/entities/teacher.entity';
import { TeacherModel } from '@/modules/teachers/infra/persistence/sequelize/models/teacher.model';

@Injectable()
export class SequelizeTeachersRepository implements ITeachersRepository {
  constructor(
    @InjectModel(TeacherModel)
    private readonly teacherModel: typeof TeacherModel,
  ) {}

  async create(teacher: Teacher): Promise<void> {
    await this.teacherModel.create({
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      passwordHash: teacher.passwordHash,
      createdAt: teacher.createdAt,
      updatedAt: teacher.updatedAt,
    });
  }

  async findByEmail(email: string): Promise<Teacher | null> {
    const model = await this.teacherModel.findOne({ where: { email } });
    if (!model) return null;
    return model.toDomain();
  }

  async findById(id: string): Promise<Teacher | null> {
    const model = await this.teacherModel.findByPk(id);
    if (!model) return null;
    return model.toDomain();
  }
}
