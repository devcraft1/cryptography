import { Body, Controller, Post } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { HashDTO } from './dto';

@Controller('hash')
export class HashingController {
  constructor(private hashing: HashingService) {}

  @Post('create')
  createHash(@Body() dto: HashDTO) {
    return this.hashing.hash(dto);
  }

  @Post('compare')
  compareHash() {
    return this.hashing.compare();
  }

  @Post('createhmac')
  createHmac() {
    return this.hashing.hmac();
  }
}
