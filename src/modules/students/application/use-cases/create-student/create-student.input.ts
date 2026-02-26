import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStudentInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  grade: string;

  @IsArray()
  @IsString({ each: true })
  profiles: string[];

  @IsString()
  @IsOptional()
  schoolClassId?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
