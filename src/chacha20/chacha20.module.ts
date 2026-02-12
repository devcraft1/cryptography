import { Module } from '@nestjs/common';
import { ChaCha20Service } from './chacha20.service';
import { ChaCha20Controller } from './chacha20.controller';

@Module({
  providers: [ChaCha20Service],
  controllers: [ChaCha20Controller],
})
export class ChaCha20Module {}
