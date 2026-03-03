import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MaterialStudentDto {
  @IsString()
  name: string;

  @IsString()
  grade: string;

  @IsString()
  profile: string;

  @IsString()
  adaptation: string;
}

export class GenerateMaterialInput {
  @IsString()
  theme: string;

  @IsString()
  objective: string;

  @IsString()
  description: string;

  @ValidateNested()
  @Type(() => MaterialStudentDto)
  studentData: MaterialStudentDto;
}
