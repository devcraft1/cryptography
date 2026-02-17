import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HkdfService } from './hkdf.service';
import { HkdfDeriveDTO, HkdfExpandDTO } from './dto';

@ApiTags('HKDF')
@Controller('hkdf')
export class HkdfController {
  constructor(private hkdf: HkdfService) {}

  @Post('derive')
  derive(@Body() dto: HkdfDeriveDTO) {
    return this.hkdf.derive(
      dto.ikm,
      dto.salt,
      dto.info,
      dto.keyLength,
      dto.hash,
    );
  }

  @Post('derive-multiple')
  deriveMultiple(@Body() dto: HkdfExpandDTO) {
    return this.hkdf.deriveMultiple(
      dto.ikm,
      dto.salt,
      dto.labels,
      dto.keyLength,
      dto.hash,
    );
  }

  @Get('demo')
  demonstrate() {
    return this.hkdf.demonstrate();
  }
}
