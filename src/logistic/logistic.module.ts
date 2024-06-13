import { Module } from '@nestjs/common';
import { LogisticController } from './controllers/logistic.controller';
import { LogisticService } from './services/logistic.service';

@Module({
  providers: [LogisticService],
  controllers: [LogisticController]
})
export class LogisticModule {}
