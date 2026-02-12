import { Module } from '@nestjs/common';
import { HybridEncryptionService } from './hybrid-encryption.service';
import { HybridEncryptionController } from './hybrid-encryption.controller';

@Module({
  providers: [HybridEncryptionService],
  controllers: [HybridEncryptionController],
})
export class HybridEncryptionModule {}
