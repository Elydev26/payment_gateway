import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionLog, TransactionLogSchema } from './models/transaction.model';
import { TransactionLogService } from './service/transactionlog.service';


@Global()
@Module({
  providers: [TransactionLogService],
  // controllers: [TransactionLogController],
  exports: [TransactionLogService],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: TransactionLog.name,
        useFactory: () => {
          return TransactionLogSchema;
        },
      },
    ]),
  ],
})
export class TransactionLogModule {}
