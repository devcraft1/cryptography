import { Controller, Post } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { HashDTO } from './dto';

@Controller('hash')
export class HashingController {
  constructor(private hashing: HashingService) {}

  @Post('create')
  createHash(dto: HashDTO) {
    return this.hashing.hash(dto.input);
  }

  @Post('compare')
  compareHash() {
    return this.hashing.compare();
  }

  @Post('createhmac')
  createhmac() {
    return this.hashing.hmac();
  }
}
