import { Module } from '@nestjs/common';
import { SaltsService } from './salts/salts.service';
import { AppController } from './app/app.controller';
import { KeypairService } from './keypair/keypair.service';

@Module({
  providers: [SaltsService, KeypairService],
  controllers: [AppController],
})
export class AppModule {}
