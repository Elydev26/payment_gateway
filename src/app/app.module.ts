import { Logger, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppService } from './services/app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envConfigValidator } from 'src/utils/validators/env.validator';
import { ConfigAPIModule } from 'src/config/config.module';
import { EnvConfigEnum } from 'src/utils/enums/envConfig.enum';
import { UserModule } from 'src/users/user.module';
import { AuthModule } from 'src/auth/auth.module';
// import { NotificationModule } from 'src/notifications/notification.module';
import { ShipmentModule } from 'src/ship/shipment.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './controllers/app.controller';
import { TransactionLogModule } from 'src/transactionlog/transactionlog.module';
import { DeserializeAuthorizationToken } from 'src/utils/middlewares/token.middleware';
import { TokenModule } from './token/token.module';


@Module({
  imports: [
    WalletModule,
    ShipmentModule,
    // NotificationModule,
    AuthModule,
    TokenModule,
    UserModule,
    ConfigAPIModule,
    TransactionLogModule,
    EventEmitterModule.forRoot({
      delimiter: '.',
      maxListeners: 10,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const connectionString = configService.get<string>(
          EnvConfigEnum.CONNECTION_STRING,
        );
        Logger.debug(`CONNECTION STRING ${connectionString}`);
        return {
          uri: connectionString,
          autoIndex: true,
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: envConfigValidator,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    return consumer
      .apply(DeserializeAuthorizationToken)
      .exclude(
        {
          path: 'auth/refresh-access-token',
          method: RequestMethod.POST,
        },
        {
          path: 'token/status',
          method: RequestMethod.GET,
        },
        {
          path: 'generic-apis/get-statistics',
          method: RequestMethod.GET,
        },
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
