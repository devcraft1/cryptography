import { Module } from '@nestjs/common';
import { EnvelopeEncryptionService } from './envelope-encryption.service';
import { EnvelopeEncryptionController } from './envelope-encryption.controller';

@Module({
  providers: [EnvelopeEncryptionService],
  controllers: [EnvelopeEncryptionController],
})
export class EnvelopeEncryptionModule {}
