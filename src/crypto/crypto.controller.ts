import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCryptoDto } from './dto/create-cryto.dto';
import { CryptoService } from './crypto.services';

@Controller('crypto')
export class CryptoController {
  constructor(public readonly app: CryptoService) {}
  @Get()
  getAll() {
    const res = this.app.getCrypto();
    return res;
  }

  @Post()
  create(@Body() newDto: CreateCryptoDto) {
    console.log(newDto);
    return newDto.amount;
  }
}
