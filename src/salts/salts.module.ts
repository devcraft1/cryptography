import { Module } from '@nestjs/common';
import { SaltsService } from './salts.service';
import { SaltsController } from './salts.controller';

@Module({
  providers: [SaltsService],
  controllers: [SaltsController],
})
export class SaltsModule {}
