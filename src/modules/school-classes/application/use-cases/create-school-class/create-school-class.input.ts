import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateSchoolClassInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  teacherId?: string;

  @IsString()
  @IsOptional()
  userId?: string;
}
