import { Module } from '@nestjs/common';
import { EncryptionService } from './encryption.service';
import { EncryptionController } from './encryption.controller';
import { KeyPairModule } from '../key-pair/keypair.module';
import { AesGcmModule } from '../aes-gcm/aes-gcm.module';

@Module({
  imports: [KeyPairModule, AesGcmModule],
  providers: [EncryptionService],
  controllers: [EncryptionController],
  exports: [EncryptionService],
})
export class EncryptionModule {}
