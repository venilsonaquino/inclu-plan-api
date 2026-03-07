import { IsNotEmpty, IsString, IsArray, ArrayMinSize, IsUUID, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class DisciplineRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  theme: string;

  @IsString()
  @IsOptional()
  observations?: string;
}

export class LessonRequest {
  @ValidateNested()
  @Type(() => DisciplineRequest)
  discipline: DisciplineRequest;

  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  students: string[]; // IDs dos alunos
}

export class GenerateLessonInput {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonRequest)
  @ArrayMinSize(1)
  lessons: LessonRequest[];

  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  teacherId: string;

  @IsString()
  @IsOptional()
  imagePart?: string; // base64
}
