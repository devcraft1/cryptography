import { Controller, Get } from '@nestjs/common';
import { EncryptionService } from './encryption.service';

@Controller('encryption')
export class EncryptionController {
  constructor(private encrypt: EncryptionService) {}

  @Get('asymmetric')
  getAsymmetricEncryption() {
    return this.encrypt.asymmetric();
  }

  @Get('symmetric')
  getSymmetricEncryption() {
    return this.encrypt.symmetric();
  }
}
