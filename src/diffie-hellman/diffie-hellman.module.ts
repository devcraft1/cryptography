import { Module } from '@nestjs/common';
import { DiffieHellmanService } from './diffie-hellman.service';
import { DiffieHellmanController } from './diffie-hellman.controller';

@Module({
  providers: [DiffieHellmanService],
  controllers: [DiffieHellmanController],
})
export class DiffieHellmanModule {}
