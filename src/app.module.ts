import { Module } from '@nestjs/common';
import { SaltsService } from './salts/salts.service';
import { AppController } from './app/app.controller';
import { KeypairService } from './keypair/keypair.service';
import { EncryptionService } from './encryption/encryption.service';
import { HashingService } from './hashing/hashing.service';

@Module({
  providers: [SaltsService, KeypairService, EncryptionService, HashingService],
  controllers: [AppController],
})
export class AppModule {}
