import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BoardStudentDto {
  @IsString()
  name: string;

  @IsString()
  grade: string;

  @IsString()
  profile: string;

  @IsString()
  adaptation: string;
}

export class GenerateBoardInput {
  @IsString()
  theme: string;

  @IsString()
  objective: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  strategyOverride?: string;

  @ValidateNested()
  @Type(() => BoardStudentDto)
  studentData: BoardStudentDto;
}
