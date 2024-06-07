import { Global, Module } from '@nestjs/common';
import { GenericAPIsController } from './controllers/genericAPIs.controllers';
import { GenericAPIsService } from './services/genericAPIS.service';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  controllers: [GenericAPIsController],
  providers: [GenericAPIsService],
  exports: [GenericAPIsService],
  imports: [],
})
export class ConfigAPIModule {}
