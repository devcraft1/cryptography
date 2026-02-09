import { Module } from '@nestjs/common';
import { DigitalSignaturesService } from './digital-signatures.service';
import { DigitalSignaturesController } from './digital-signatures.controller';

@Module({
  providers: [DigitalSignaturesService],
  controllers: [DigitalSignaturesController],
})
export class DigitalSignaturesModule {}
