import { Module } from '@nestjs/common';
import { SaltsService } from './salts/salts.service';
import { AppController } from './app.controller';
import { KeypairService } from './keypair/keypair.service';
import { EncryptionService } from './encryption/encryption.service';
import { HashingService } from './hashing/hashing.service';
import { HmacService } from './hmac/hmac.service';
import { DigitalSignaturesService } from './digital-signatures/digital-signatures.service';
import { KeyDerivationService } from './key-derivation/key-derivation.service';

@Module({
  providers: [
    SaltsService,
    KeypairService,
    EncryptionService,
    HashingService,
    HmacService,
    DigitalSignaturesService,
    KeyDerivationService,
  ],
  controllers: [AppController],
})
export class AppModule {}
