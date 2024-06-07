import { Logger, Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { UserModule } from 'src/users/user.module';
import { UserService } from 'src/users/service/user.service';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports:[UserModule,WalletModule],

})
export class AuthModule {}
