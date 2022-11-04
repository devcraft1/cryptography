import { Controller, Get } from '@nestjs/common';
import { CryptoService } from './crypto.services';

@Controller('crypto')
export class CryptoController {
  constructor(public readonly app: CryptoService) {}
  @Get()
  getAll() {
    const res = this.app.getCrypto();
    return res;
  }
}
