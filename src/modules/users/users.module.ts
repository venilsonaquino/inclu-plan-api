import { Module } from '@nestjs/common';
import { UsersController } from './infra/http/users.controller';

@Module({
  controllers: [UsersController],
  providers: [],
})
export class UsersModule { }
