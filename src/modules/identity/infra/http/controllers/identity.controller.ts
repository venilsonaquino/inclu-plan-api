import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { RegisterUserUseCase } from '@/modules/identity/application/use-cases/register-user/register-user.use-case';
import { LoginUserUseCase } from '@/modules/identity/application/use-cases/login-user/login-user.use-case';
import { RegisterUserInput } from '@/modules/identity/application/use-cases/register-user/register-user.input';
import { LoginUserInput } from '@/modules/identity/application/use-cases/login-user/login-user.input';
import { Response } from 'express';

@Controller('identity')
export class IdentityController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  @Post('register')
  async register(@Body() input: RegisterUserInput, @Res() res: Response) {
    const result = await this.registerUserUseCase.execute(input);

    if (result.isSuccess) {
      return res.status(HttpStatus.CREATED).json(result.getValue());
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: result.errorValue() });
    }
  }

  @Post('login')
  async login(@Body() input: LoginUserInput, @Res() res: Response) {
    const result = await this.loginUserUseCase.execute(input);

    if (result.isSuccess) {
      return res.status(HttpStatus.OK).json(result.getValue());
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: result.errorValue() });
    }
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    // For stateless JWT, logout is often handled client side by removing the token.
    // If you need a backend mechanism, you'd implement a blacklist or something similar.
    return res.status(HttpStatus.OK).json({ message: 'Successfully logged out' });
  }
}
