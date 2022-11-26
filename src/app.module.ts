import { Module } from '@nestjs/common';
import { SaltsService } from './salts/salts.service';
import { AppController } from './app/app.controller';

@Module({
  providers: [SaltsService],
  controllers: [AppController],
})
export class AppModule {}
