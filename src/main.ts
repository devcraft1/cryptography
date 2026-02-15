import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.use(express.json({ limit: '100kb' }));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // WARNING: In production, set CORS_ORIGIN env var to restrict cross-origin access
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
  });

  const port = process.env.PORT || 7000;
  await app.listen(port);
  Logger.log(`Cryptography API running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
