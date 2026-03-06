import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from './modules/ai/ai.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { StudentsModule } from './modules/students/students.module';
import { SchoolClassesModule } from './modules/school-classes/school-classes.module';
import { GradesModule } from './modules/grades/grades.module';
import { LearningProfilesModule } from './modules/learning-profiles/learning-profiles.module';
import { StudentLearningProfilesModule } from './modules/student-learning-profiles/student-learning-profiles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AiModule,
    TeachersModule,
    StudentsModule,
    SchoolClassesModule,
    GradesModule,
    LearningProfilesModule,
    StudentLearningProfilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
