import { Module } from '@nestjs/common';
import { EncryptionService } from './encryption.service';
import { EncryptionController } from './encryption.controller';
import { KeyPairModule } from '../key-pair/keypair.module';

@Module({
  imports: [KeyPairModule],
  providers: [EncryptionService],
  controllers: [EncryptionController],
})
export class EncryptionModule {}
