import { Module } from '@nestjs/common';
import { KeypairService } from './keypair.service';
import { KeypairController } from './keypair.controller';

@Module({
  providers: [KeypairService],
  controllers: [KeypairController],
  exports: [KeypairService],
})
export class KeyPairModule {}
