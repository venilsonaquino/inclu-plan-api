import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IdentityController } from '@/modules/identity/infra/http/controllers/identity.controller';
import { RegisterUserUseCase } from '@/modules/identity/application/use-cases/register-user/register-user.use-case';
import { LoginUserUseCase } from '@/modules/identity/application/use-cases/login-user/login-user.use-case';
import { UserModel } from '@/modules/identity/infra/persistence/sequelize/models/user.model';
import { IUsersRepository } from '@/modules/identity/domain/repositories/users.repository';
import { SequelizeUsersRepository } from '@/modules/identity/infra/persistence/sequelize/repositories/sequelize-users.repository';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '@/modules/identity/infra/http/strategies/jwt.strategy';
import { TeachersModule } from '@/modules/teachers/teachers.module';

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel]),
    PassportModule,
    TeachersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'fallback_secret_for_dev',
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [IdentityController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    JwtStrategy,
    {
      provide: IUsersRepository,
      useClass: SequelizeUsersRepository,
    },
  ],
  exports: [IUsersRepository, JwtModule, PassportModule],
})
export class IdentityModule {}
