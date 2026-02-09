import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HashingModule } from './hashing/hashing.module';
import { KeyPairModule } from './key-pair/keypair.module';
import { EncryptionModule } from './encryption/encryption.module';
import { SaltsModule } from './salts/salts.module';
import { HmacModule } from './hmac/hmac.module';
import { DigitalSignaturesModule } from './digital-signatures/digital-signatures.module';
import { KeyDerivationModule } from './key-derivation/key-derivation.module';
import { PostQuantumModule } from './post-quantum/post-quantum.module';

@Module({
  imports: [
    HashingModule,
    KeyPairModule,
    EncryptionModule,
    SaltsModule,
    HmacModule,
    DigitalSignaturesModule,
    KeyDerivationModule,
    PostQuantumModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
