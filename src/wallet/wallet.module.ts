import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, walletModel } from './model/wallet.model';
import { WalletService } from './service/wallet.service';
import { WalletController } from './controller/wallet.controller';
import { CreateUserWalletListener } from './listeners/wallet.listener';
import { UserModule } from '../users/user.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => PaymentModule),  
    // MongooseModule.forFeature([{ name: Wallet.name, schema: walletModel }]),
    MongooseModule.forFeatureAsync([
      {
        name: Wallet.name,
        useFactory: () => {
          return walletModel;
        },
      },
    ]),
    
  ],
  providers: [WalletService, CreateUserWalletListener],
  controllers: [WalletController],
  exports: [WalletService],
})
export class WalletModule {}
