import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiffieHellmanService } from './diffie-hellman.service';
import { EcdhDTO } from './dto';

@ApiTags('Diffie-Hellman')
@Controller('dh')
export class DiffieHellmanController {
  constructor(private dh: DiffieHellmanService) {}

  @Get('classic')
  classicDH() {
    return this.dh.classicDH();
  }

  @Post('ecdh')
  ecdhKeyExchange(@Body() dto: EcdhDTO) {
    return this.dh.ecdhKeyExchange(dto.curve);
  }

  @Get('demo')
  demonstrate() {
    return this.dh.demonstrate();
  }
}
