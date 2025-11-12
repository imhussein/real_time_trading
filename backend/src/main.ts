import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { RequestIdMiddleware } from './middlewares/request-id.middleware';
import { GlobalValidationPipe } from './pipes/global-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(helmet());
  app.use(new RequestIdMiddleware().use);
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(GlobalValidationPipe);

  app.enableVersioning({ type: VersioningType.URI });

  const port = 4001;
  await app.listen(port);

  console.log(`Market Data Test Backend Listning on port ${port}`);
}
bootstrap();
