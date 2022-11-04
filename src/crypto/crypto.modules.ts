import { Module } from '@nestjs/common';
import { CryptoController } from './crypto.controller';
import { CryptoService } from './crypto.services';

@Module({
  controllers: [CryptoController],
  providers: [CryptoService],
})
export class CryptoModule {}
