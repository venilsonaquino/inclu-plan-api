import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AiModule } from './modules/ai/ai.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { StudentsModule } from './modules/students/students.module';
import { SchoolClassesModule } from './modules/school-classes/school-classes.module';
import { GradesModule } from './modules/grades/grades.module';
import { NeurodivergenciesModule } from './modules/neurodivergencies/neurodivergencies.module';
import { StudentNeurodivergenciesModule } from './modules/student-neurodivergencies/student-neurodivergencies.module';
import { LessonsModule } from './modules/lessons/lessons.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        autoLoadModels: true,
        synchronize: false, // Em prod e usando migrations, synchronize deve ser false
        logging: false,
      }),
      inject: [ConfigService],
    }),
    AiModule,
    TeachersModule,
    StudentsModule,
    SchoolClassesModule,
    GradesModule,
    NeurodivergenciesModule,
    StudentNeurodivergenciesModule,
    LessonsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
