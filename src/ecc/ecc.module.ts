import { Module } from '@nestjs/common';
import { EccService } from './ecc.service';
import { EccController } from './ecc.controller';

@Module({
  providers: [EccService],
  controllers: [EccController],
  exports: [EccService],
})
export class EccModule {}
