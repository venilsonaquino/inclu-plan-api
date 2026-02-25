import { IsString, IsArray, ValidateNested, IsOptional, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class StudentDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  grade?: string;

  @IsArray()
  @IsString({ each: true })
  profiles: string[];
}

export class GenerateLessonInput {
  @IsString()
  content: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentDto)
  @ArrayMinSize(1)
  students: StudentDto[];

  @IsString()
  @IsOptional()
  imagePart?: string; // base64
}
