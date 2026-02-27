import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSchoolClassInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  teacherId: string;
}
