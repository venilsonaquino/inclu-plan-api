import { Injectable, Logger } from '@nestjs/common';
import { IUsersRepository } from '@/modules/identity/domain/repositories/users.repository';
import { RegisterUserInput } from './register-user.input';
import { Result } from '@/shared/domain/utils/result';
import { User } from '@/modules/identity/domain/entities/user.entity';
import { CryptoUtil } from '@/shared/utils/crypto.util';

export class RegisterUserOutput {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class RegisterUserUseCase {
  private readonly logger = new Logger(RegisterUserUseCase.name);

  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(input: RegisterUserInput): Promise<Result<RegisterUserOutput>> {
    try {
      const existingUser = await this.usersRepository.findByEmail(input.email);

      if (existingUser) {
        return Result.fail('Email already in use.');
      }

      const hashedPassword = await CryptoUtil.hash(input.password);

      const newUser = new User({
        id: crypto.randomUUID(),
        name: input.name,
        email: input.email,
        passwordHash: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await this.usersRepository.create(newUser);

      return Result.ok({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      });
    } catch (error) {
      this.logger.error('Unexpected error registering user', error instanceof Error ? error.stack : error);
      return Result.fail('An unexpected error occurred while registering the user.');
    }
  }
}
