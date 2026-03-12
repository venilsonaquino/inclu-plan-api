import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginUserInput {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
