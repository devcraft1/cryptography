import { Body, Controller, Get, Post } from '@nestjs/common';
import { EnvelopeEncryptionService } from './envelope-encryption.service';
import { EnvelopeEncryptDTO, EnvelopeDecryptDTO, RotateKeyDTO } from './dto';

@Controller('envelope')
export class EnvelopeEncryptionController {
  constructor(private envelopeEncryption: EnvelopeEncryptionService) {}

  @Get('generate-master-key')
  generateMasterKey() {
    return this.envelopeEncryption.generateMasterKey();
  }

  @Post('encrypt')
  encrypt(@Body() dto: EnvelopeEncryptDTO) {
    return this.envelopeEncryption.encrypt(dto.plaintext, dto.masterKey);
  }

  @Post('decrypt')
  decrypt(@Body() dto: EnvelopeDecryptDTO) {
    return this.envelopeEncryption.decrypt(dto.envelope, dto.masterKey);
  }

  @Post('rotate-key')
  rotateKey(@Body() dto: RotateKeyDTO) {
    return this.envelopeEncryption.rotateMasterKey(
      dto.envelope,
      dto.oldMasterKey,
      dto.newMasterKey,
    );
  }

  @Get('demo')
  demonstrate() {
    return this.envelopeEncryption.demonstrate();
  }
}
