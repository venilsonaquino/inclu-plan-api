import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNeurodivergencyInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsNotEmpty()
  position: number;
}
