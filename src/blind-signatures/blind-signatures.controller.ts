import { Body, Controller, Get, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags } from '@nestjs/swagger';
import { BlindSignaturesService } from './blind-signatures.service';
import { BlindDTO, SignBlindDTO, UnblindDTO, VerifyBlindDTO } from './dto';

@ApiTags('Blind Signatures')
@Controller('blind-signatures')
export class BlindSignaturesController {
  constructor(private blindSignaturesService: BlindSignaturesService) {}

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Get('keygen')
  generateKeys() {
    return this.blindSignaturesService.generateKeys();
  }

  @Post('blind')
  blind(@Body() dto: BlindDTO) {
    return this.blindSignaturesService.blind(
      dto.message,
      dto.publicKeyN,
      dto.publicKeyE,
    );
  }

  @Post('sign')
  sign(@Body() dto: SignBlindDTO) {
    return this.blindSignaturesService.signBlinded(
      dto.blindedMessage,
      dto.privateKeyD,
      dto.publicKeyN,
    );
  }

  @Post('unblind')
  unblind(@Body() dto: UnblindDTO) {
    return this.blindSignaturesService.unblind(
      dto.blindedSignature,
      dto.blindingFactor,
      dto.publicKeyN,
    );
  }

  @Post('verify')
  verify(@Body() dto: VerifyBlindDTO) {
    return this.blindSignaturesService.verify(
      dto.message,
      dto.signature,
      dto.publicKeyN,
      dto.publicKeyE,
    );
  }

  @Get('demo')
  demonstrate() {
    return this.blindSignaturesService.demonstrate();
  }
}
