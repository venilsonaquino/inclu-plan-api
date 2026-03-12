import { Injectable, Logger } from '@nestjs/common';
import { IUsersRepository } from '@/modules/identity/domain/repositories/users.repository';
import { LoginUserInput } from './login-user.input';
import { Result } from '@/shared/domain/utils/result';
import { CryptoUtil } from '@/shared/utils/crypto.util';

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
    // Typically, a JwtService would be injected here to generate tokens
    // For now, we will return a placeholder token, or if @nestjs/jwt is available, we can mock it or use it.
    // Assuming a simple implementation for now.
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

      // Generate a mock JWT for now (In a real app, use JwtService)
      // Since I don't know the exact Jwt config, I'll return a stub. 
      // It can be refactored when integrating IdentityModule with JwtModule.
      const payload = Buffer.from(JSON.stringify({ sub: user.id, email: user.email })).toString('base64');
      const token = `header.${payload}.signature`;

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
