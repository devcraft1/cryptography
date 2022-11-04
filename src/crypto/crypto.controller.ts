import {
  Controller,
  Get,
  Req,
  Query,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { Request } from 'express';
import { stringify } from 'querystring';
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
