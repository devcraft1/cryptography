import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AesGcmService } from './aes-gcm.service';
import { AesGcmEncryptDTO, AesGcmDecryptDTO } from './dto';

@ApiTags('AES-GCM')
@Controller('aes-gcm')
export class AesGcmController {
  constructor(private aesGcm: AesGcmService) {}

  @Post('encrypt')
  encrypt(@Body() dto: AesGcmEncryptDTO) {
    return this.aesGcm.encrypt(dto.plaintext, dto.key);
  }

  @Post('decrypt')
  decrypt(@Body() dto: AesGcmDecryptDTO) {
    return this.aesGcm.decrypt(dto.ciphertext, dto.key, dto.iv, dto.authTag);
  }

  @Get('demo')
  demonstrate() {
    return this.aesGcm.demonstrate();
  }
}
