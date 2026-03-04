import { Module } from '@nestjs/common';
import { HmacService } from './hmac.service';
import { HmacController } from './hmac.controller';

@Module({
  providers: [HmacService],
  controllers: [HmacController],
  exports: [HmacService],
})
export class HmacModule {}
