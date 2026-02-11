import { Module } from '@nestjs/common';
import { AesGcmService } from './aes-gcm.service';
import { AesGcmController } from './aes-gcm.controller';

@Module({
  providers: [AesGcmService],
  controllers: [AesGcmController],
})
export class AesGcmModule {}
