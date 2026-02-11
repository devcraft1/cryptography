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
import { EncodingModule } from './encoding/encoding.module';
import { RandomModule } from './random/random.module';
import { AesGcmModule } from './aes-gcm/aes-gcm.module';
import { DiffieHellmanModule } from './diffie-hellman/diffie-hellman.module';
import { EccModule } from './ecc/ecc.module';
import { OtpModule } from './otp/otp.module';
import { CertificatesModule } from './certificates/certificates.module';
import { SecretSharingModule } from './secret-sharing/secret-sharing.module';
import { JwtModule } from './jwt/jwt.module';

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
    EncodingModule,
    RandomModule,
    AesGcmModule,
    DiffieHellmanModule,
    EccModule,
    OtpModule,
    CertificatesModule,
    SecretSharingModule,
    JwtModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
