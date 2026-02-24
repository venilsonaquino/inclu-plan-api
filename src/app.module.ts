import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { WalletsModule } from './modules/wallets/wallets.module';

@Module({
  imports: [UsersModule, WalletsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
