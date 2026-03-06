import { IsNotEmpty, IsString, IsArray, ValidateNested, IsOptional, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class DisciplineInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  theme: string;

  @IsOptional()
  @IsString()
  observations?: string;
}

export class DayInput {
  @IsString()
  @IsNotEmpty()
  day: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DisciplineInput)
  disciplines: DisciplineInput[];
}

export class StudentDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  grade?: string;

  @IsArray()
  @IsString({ each: true })
  neurodivergencies: string[];
}

export class GenerateLessonInput {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayInput)
  days: DayInput[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentDto)
  @ArrayMinSize(1)
  students: StudentDto[];

  @IsString()
  @IsOptional()
  imagePart?: string; // base64
}
