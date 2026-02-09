import { Body, Controller, Get, Post } from '@nestjs/common';
import { DigitalSignaturesService } from './digital-signatures.service';
import { SignMessageDTO } from './dto';

@Controller('signatures')
export class DigitalSignaturesController {
  constructor(private digitalSignatures: DigitalSignaturesService) {}

  @Post('sign')
  signMessage(@Body() dto: SignMessageDTO) {
    return {
      signature: this.digitalSignatures.signMessage(dto.message),
      message: dto.message,
    };
  }

  @Post('verify')
  verifySignature(
    @Body() dto: { message: string; signature: string; publicKey?: string },
  ) {
    return {
      isValid: this.digitalSignatures.verifySignature(
        dto.message,
        dto.signature,
        dto.publicKey,
      ),
      message: dto.message,
    };
  }

  @Get('demo')
  demonstrateDigitalSignature() {
    return this.digitalSignatures.demonstrateDigitalSignature();
  }

  @Get('keypair')
  generateSignatureKeyPair() {
    return this.digitalSignatures.generateKeyPair();
  }
}
