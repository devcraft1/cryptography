import { Module } from '@nestjs/common';
import { EncodingService } from './encoding.service';
import { EncodingController } from './encoding.controller';

@Module({
  providers: [EncodingService],
  controllers: [EncodingController],
})
export class EncodingModule {}
