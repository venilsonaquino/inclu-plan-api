import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MaterialStudentDto {
  @IsString()
  name: string;

  @IsString()
  profile: string;
}

export class GenerateMaterialInput {
  @IsString()
  activityText: string;

  @ValidateNested()
  @Type(() => MaterialStudentDto)
  studentData: MaterialStudentDto;
}
