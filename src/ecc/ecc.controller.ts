import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { EccService } from './ecc.service';
import { EccKeygenDTO, EccSignDTO, EccVerifyDTO } from './dto';

@ApiTags('ECC')
@Controller('ecc')
export class EccController {
  constructor(private ecc: EccService) {}

  @Post('keygen')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  generateKeyPair(@Body() dto: EccKeygenDTO) {
    return this.ecc.generateFreshKeyPair(dto.curve);
  }

  @Post('sign')
  sign(@Body() dto: EccSignDTO) {
    return this.ecc.sign(dto.message, dto.privateKey);
  }

  @Post('verify')
  verify(@Body() dto: EccVerifyDTO) {
    return this.ecc.verify(dto.message, dto.signature, dto.publicKey);
  }

  @Get('demo')
  demonstrate() {
    return this.ecc.demonstrate();
  }
}
