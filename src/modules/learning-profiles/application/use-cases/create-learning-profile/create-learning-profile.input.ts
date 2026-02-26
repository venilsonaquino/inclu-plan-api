import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLearningProfileInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
