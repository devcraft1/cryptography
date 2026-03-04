import { Module } from '@nestjs/common';
import { ZkpService } from './zkp.service';
import { ZkpController } from './zkp.controller';

@Module({
  providers: [ZkpService],
  controllers: [ZkpController],
  exports: [ZkpService],
})
export class ZkpModule {}
