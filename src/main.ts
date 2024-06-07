import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { CanPerformAction } from './utils/guards/canPerform.guard';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfigEnum } from './utils/enums/envConfig.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOptions = {
    origin: '*',
  };
  app.enableCors(corsOptions);
  // use to enforce permission access on endpoints that have permission
  const reflector = app.get(Reflector);
  const config = app.get(ConfigService);
  app.useGlobalGuards(new CanPerformAction(reflector));
  const port = config.get<number>(EnvConfigEnum.PORT) || 3000;
  await app.listen(port);
  Logger.debug(`🚀 Application is running on port: ${port}`);

}
bootstrap();
