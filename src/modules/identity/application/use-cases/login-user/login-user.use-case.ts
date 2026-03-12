import { Injectable, Logger } from '@nestjs/common';
import { IUsersRepository } from '@/modules/identity/domain/repositories/users.repository';
import { LoginUserInput } from './login-user.input';
import { Result } from '@/shared/domain/utils/result';
import { CryptoUtil } from '@/shared/utils/crypto.util';

import { JwtService } from '@nestjs/jwt';

export class LoginUserOutput {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

@Injectable()
export class LoginUserUseCase {
  private readonly logger = new Logger(LoginUserUseCase.name);

  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: LoginUserInput): Promise<Result<LoginUserOutput>> {
    try {
      const user = await this.usersRepository.findByEmail(input.email);

      if (!user) {
        return Result.fail('Invalid email or password.');
      }

      const isPasswordValid = await CryptoUtil.compare(input.password, user.passwordHash);

      if (!isPasswordValid) {
        return Result.fail('Invalid email or password.');
      }

      const payload = { sub: user.id, email: user.email };
      const token = await this.jwtService.signAsync(payload);

      return Result.ok({
        accessToken: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      this.logger.error('Unexpected error logging in user', error instanceof Error ? error.stack : error);
      return Result.fail('An unexpected error occurred during login.');
    }
  }
}
