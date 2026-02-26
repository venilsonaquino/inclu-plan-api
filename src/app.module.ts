import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { AiModule } from './modules/ai/ai.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { StudentsModule } from './modules/students/students.module';
import { SchoolClassesModule } from './modules/school-classes/school-classes.module';
import { GradesModule } from './modules/grades/grades.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    WalletsModule,
    AiModule,
    TeachersModule,
    StudentsModule,
    SchoolClassesModule,
    GradesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
