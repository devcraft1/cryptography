import { Module } from '@nestjs/common';
import { HkdfService } from './hkdf.service';
import { HkdfController } from './hkdf.controller';

@Module({
  providers: [HkdfService],
  controllers: [HkdfController],
})
export class HkdfModule {}
