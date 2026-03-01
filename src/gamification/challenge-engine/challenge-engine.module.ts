import { Module } from '@nestjs/common';
import { ChallengeEngineService } from './challenge-engine.service';
import { EncodingModule } from '../../encoding/encoding.module';
import { HashingModule } from '../../hashing/hashing.module';
import { RandomModule } from '../../random/random.module';
import { SaltsModule } from '../../salts/salts.module';
import { AesGcmModule } from '../../aes-gcm/aes-gcm.module';
import { ChaCha20Module } from '../../chacha20/chacha20.module';
import { HmacModule } from '../../hmac/hmac.module';
import { KeyPairModule } from '../../key-pair/keypair.module';
import { EncryptionModule } from '../../encryption/encryption.module';
import { DiffieHellmanModule } from '../../diffie-hellman/diffie-hellman.module';
import { EccModule } from '../../ecc/ecc.module';
import { KeyDerivationModule } from '../../key-derivation/key-derivation.module';
import { HkdfModule } from '../../hkdf/hkdf.module';
import { DigitalSignaturesModule } from '../../digital-signatures/digital-signatures.module';
import { JwtModule } from '../../jwt/jwt.module';
import { CertificatesModule } from '../../certificates/certificates.module';
import { OtpModule } from '../../otp/otp.module';
import { HybridEncryptionModule } from '../../hybrid-encryption/hybrid-encryption.module';
import { KeyWrappingModule } from '../../key-wrapping/key-wrapping.module';
import { EnvelopeEncryptionModule } from '../../envelope-encryption/envelope-encryption.module';
import { CommitmentModule } from '../../commitment/commitment.module';
import { SecretSharingModule } from '../../secret-sharing/secret-sharing.module';
import { MerkleTreeModule } from '../../merkle-tree/merkle-tree.module';
import { BlindSignaturesModule } from '../../blind-signatures/blind-signatures.module';
import { ZkpModule } from '../../zkp/zkp.module';
import { PostQuantumModule } from '../../post-quantum/post-quantum.module';

@Module({
  imports: [
    EncodingModule,
    HashingModule,
    RandomModule,
    SaltsModule,
    AesGcmModule,
    ChaCha20Module,
    HmacModule,
    KeyPairModule,
    EncryptionModule,
    DiffieHellmanModule,
    EccModule,
    KeyDerivationModule,
    HkdfModule,
    DigitalSignaturesModule,
    JwtModule,
    CertificatesModule,
    OtpModule,
    HybridEncryptionModule,
    KeyWrappingModule,
    EnvelopeEncryptionModule,
    CommitmentModule,
    SecretSharingModule,
    MerkleTreeModule,
    BlindSignaturesModule,
    ZkpModule,
    PostQuantumModule,
  ],
  providers: [ChallengeEngineService],
  exports: [ChallengeEngineService],
})
export class ChallengeEngineModule {}
