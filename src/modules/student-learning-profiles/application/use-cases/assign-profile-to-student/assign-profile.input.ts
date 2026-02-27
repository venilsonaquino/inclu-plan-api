import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AssignProfileInput {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  learningProfileId: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
