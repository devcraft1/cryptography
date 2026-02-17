import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HybridEncryptionService } from './hybrid-encryption.service';
import { HybridEncryptDTO, HybridDecryptDTO } from './dto';

@ApiTags('Hybrid Encryption')
@Controller('hybrid')
export class HybridEncryptionController {
  constructor(private hybridEncryption: HybridEncryptionService) {}

  @Get('keygen')
  generateKeyPair() {
    return this.hybridEncryption.generateKeyPair();
  }

  @Post('encrypt')
  encrypt(@Body() dto: HybridEncryptDTO) {
    return this.hybridEncryption.encrypt(dto.plaintext, dto.publicKey);
  }

  @Post('decrypt')
  decrypt(@Body() dto: HybridDecryptDTO) {
    return this.hybridEncryption.decrypt(
      dto.encryptedKey,
      dto.ciphertext,
      dto.iv,
      dto.authTag,
      dto.privateKey,
    );
  }

  @Get('demo')
  demonstrate() {
    return this.hybridEncryption.demonstrate();
  }
}
