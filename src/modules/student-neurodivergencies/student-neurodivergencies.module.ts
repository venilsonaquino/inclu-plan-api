import { Module } from '@nestjs/common';
import { IStudentNeurodivergenciesRepository } from './domain/repositories/student-neurodivergencies.repository';
import { SequelizeStudentNeurodivergenciesRepository } from './infra/persistence/sequelize/repositories/sequelize-student-neurodivergencies.repository';
import { StudentNeurodivergencyModel } from './infra/persistence/sequelize/models/student-neurodivergency.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([StudentNeurodivergencyModel])],
  controllers: [], // Placeholder for controller if needed
  providers: [
    {
      provide: IStudentNeurodivergenciesRepository,
      useClass: SequelizeStudentNeurodivergenciesRepository,
    },
  ],
  exports: [IStudentNeurodivergenciesRepository],
})
export class StudentNeurodivergenciesModule { }
