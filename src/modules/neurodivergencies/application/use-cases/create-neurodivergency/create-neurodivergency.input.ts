import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNeurodivergencyInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
