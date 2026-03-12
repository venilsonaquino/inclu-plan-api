import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IdentityController } from '@/modules/identity/infra/http/controllers/identity.controller';
import { RegisterUserUseCase } from '@/modules/identity/application/use-cases/register-user/register-user.use-case';
import { LoginUserUseCase } from '@/modules/identity/application/use-cases/login-user/login-user.use-case';
import { UserModel } from '@/modules/identity/infra/persistence/sequelize/models/user.model';
import { IUsersRepository } from '@/modules/identity/domain/repositories/users.repository';
import { SequelizeUsersRepository } from '@/modules/identity/infra/persistence/sequelize/repositories/sequelize-users.repository';

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  controllers: [IdentityController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    {
      provide: IUsersRepository,
      useClass: SequelizeUsersRepository,
    },
  ],
  exports: [IUsersRepository],
})
export class IdentityModule {}
