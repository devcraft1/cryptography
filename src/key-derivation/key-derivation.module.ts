import { Module } from '@nestjs/common';
import { KeyDerivationService } from './key-derivation.service';
import { KeyDerivationController } from './key-derivation.controller';

@Module({
  providers: [KeyDerivationService],
  controllers: [KeyDerivationController],
})
export class KeyDerivationModule {}
