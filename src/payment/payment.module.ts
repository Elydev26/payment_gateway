import { Global, Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentController } from './controller/remita.controller';
import { PaymentService } from './services/remita.service';
import { TransactionLogModule } from '../transactionlog/transactionlog.module';
import { WalletModule } from '../wallet/wallet.module';
import { ShipmentModule } from '../ship/shipment.module';
import { TransactionLog, TransactionLogSchema } from '../transactionlog/models/transaction.model';
import { ShipmentService } from '../ship/service/shipment.service';

@Global()
@Module({
  providers: [PaymentService],
  controllers: [PaymentController],
  imports: [
    forwardRef(() => TransactionLogModule),
    forwardRef(() => WalletModule),
    forwardRef(() => ShipmentModule),
    // MongooseModule.forFeature([{ name: TransactionLog.name, schema: TransactionLogSchema }]),
    MongooseModule.forFeatureAsync([
      {
        name: TransactionLog.name,
        useFactory: () => {
          return TransactionLogSchema;
        },
      },
    ]),
  ],
  exports: [PaymentService], 
})
export class PaymentModule {}
