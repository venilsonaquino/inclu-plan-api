import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IUsersRepository } from '@/modules/identity/domain/repositories/users.repository';
import { User } from '@/modules/identity/domain/entities/user.entity';
import { UserModel } from '@/modules/identity/infra/persistence/sequelize/models/user.model';

@Injectable()
export class SequelizeUsersRepository implements IUsersRepository {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
  ) {}

  async create(user: User): Promise<void> {
    await this.userModel.create({
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const model = await this.userModel.findOne({ where: { email } });
    if (!model) return null;
    return model.toDomain();
  }

  async findById(id: string): Promise<User | null> {
    const model = await this.userModel.findByPk(id);
    if (!model) return null;
    return model.toDomain();
  }
}
