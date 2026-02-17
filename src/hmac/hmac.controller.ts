import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HmacService } from './hmac.service';
import { HmacDTO, HmacVerifyDTO } from './dto';

@ApiTags('HMAC')
@Controller('hmac')
export class HmacController {
  constructor(private hmac: HmacService) {}

  @Post('generate')
  generateHmac(@Body() dto: HmacDTO) {
    return {
      hmac: this.hmac.generateHmac(dto.message, dto.key),
      message: dto.message,
    };
  }

  @Post('verify')
  verifyHmac(@Body() dto: HmacVerifyDTO) {
    return {
      isValid: this.hmac.verifyHmac(dto.message, dto.key, dto.expectedHmac),
      message: dto.message,
    };
  }

  @Get('demo')
  demonstrateHmac() {
    return this.hmac.demonstrateHmac();
  }
}
