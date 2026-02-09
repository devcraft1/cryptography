import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();
  const port = process.env.PORT || 7000;
  await app.listen(port);
  console.log(`Cryptography API running on http://localhost:${port}`);
}
bootstrap();
