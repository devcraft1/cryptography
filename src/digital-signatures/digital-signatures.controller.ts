import { Body, Controller, Get, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags } from '@nestjs/swagger';
import { DigitalSignaturesService } from './digital-signatures.service';
import { SignMessageDTO, VerifySignatureDTO } from './dto';

@ApiTags('Digital Signatures')
@Controller('signatures')
export class DigitalSignaturesController {
  constructor(private digitalSignatures: DigitalSignaturesService) {}

  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Post('sign')
  signMessage(@Body() dto: SignMessageDTO) {
    return {
      signature: this.digitalSignatures.signMessage(dto.message),
      message: dto.message,
    };
  }

  @Post('verify')
  verifySignature(@Body() dto: VerifySignatureDTO) {
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

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Get('keypair')
  generateSignatureKeyPair() {
    return this.digitalSignatures.generateFreshKeyPair();
  }
}
