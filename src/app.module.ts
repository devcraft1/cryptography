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
import { HybridEncryptionModule } from './hybrid-encryption/hybrid-encryption.module';
import { HkdfModule } from './hkdf/hkdf.module';
import { MerkleTreeModule } from './merkle-tree/merkle-tree.module';
import { CommitmentModule } from './commitment/commitment.module';
import { ZkpModule } from './zkp/zkp.module';
import { KeyWrappingModule } from './key-wrapping/key-wrapping.module';
import { BlindSignaturesModule } from './blind-signatures/blind-signatures.module';
import { EnvelopeEncryptionModule } from './envelope-encryption/envelope-encryption.module';
import { ChaCha20Module } from './chacha20/chacha20.module';

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
    HybridEncryptionModule,
    HkdfModule,
    MerkleTreeModule,
    CommitmentModule,
    ZkpModule,
    KeyWrappingModule,
    BlindSignaturesModule,
    EnvelopeEncryptionModule,
    ChaCha20Module,
  ],
  controllers: [AppController],
})
export class AppModule {}
