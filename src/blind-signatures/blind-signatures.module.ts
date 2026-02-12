import { Module } from '@nestjs/common';
import { BlindSignaturesService } from './blind-signatures.service';
import { BlindSignaturesController } from './blind-signatures.controller';

@Module({
  providers: [BlindSignaturesService],
  controllers: [BlindSignaturesController],
})
export class BlindSignaturesModule {}
