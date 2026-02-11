import { Body, Controller, Get, Post } from '@nestjs/common';
import { RandomService } from './random.service';
import { RandomBytesDTO, RandomIntDTO } from './dto';

@Controller('random')
export class RandomController {
  constructor(private random: RandomService) {}

  @Post('bytes')
  generateBytes(@Body() dto: RandomBytesDTO) {
    return this.random.generateBytes(dto.size);
  }

  @Get('uuid')
  generateUuid() {
    return this.random.generateUuid();
  }

  @Post('integer')
  generateInt(@Body() dto: RandomIntDTO) {
    return this.random.generateInt(dto.min, dto.max);
  }

  @Get('demo')
  demonstrate() {
    return this.random.demonstrate();
  }
}
