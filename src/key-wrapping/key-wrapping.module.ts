import { Module } from '@nestjs/common';
import { KeyWrappingService } from './key-wrapping.service';
import { KeyWrappingController } from './key-wrapping.controller';

@Module({
  providers: [KeyWrappingService],
  controllers: [KeyWrappingController],
})
export class KeyWrappingModule {}
