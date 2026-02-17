import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EncryptionService } from './encryption.service';

@ApiTags('Encryption')
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
