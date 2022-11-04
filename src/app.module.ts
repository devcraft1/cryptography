import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CryptoModule } from './crypto/crypto.modules';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CryptoModule],
})
export class AppModule {}
