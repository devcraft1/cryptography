import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostQuantumService } from './post-quantum.service';
import {
  KemKeygenDTO,
  KemEncapsulateDTO,
  KemDecapsulateDTO,
  DsaKeygenDTO,
  DsaSignDTO,
  DsaVerifyDTO,
  SlhKeygenDTO,
  SlhSignDTO,
  SlhVerifyDTO,
} from './dto';

@Controller('pqc')
export class PostQuantumController {
  constructor(private postQuantum: PostQuantumService) {}

  // ML-KEM
  @Get('kem/demo')
  demonstrateKem() {
    return this.postQuantum.demonstrateKem();
  }

  @Post('kem/keygen')
  kemKeygen(@Body() dto: KemKeygenDTO) {
    return this.postQuantum.kemKeygen(dto.variant);
  }

  @Post('kem/encapsulate')
  kemEncapsulate(@Body() dto: KemEncapsulateDTO) {
    return this.postQuantum.kemEncapsulate(dto.publicKey, dto.variant);
  }

  @Post('kem/decapsulate')
  kemDecapsulate(@Body() dto: KemDecapsulateDTO) {
    return this.postQuantum.kemDecapsulate(
      dto.cipherText,
      dto.secretKey,
      dto.variant,
    );
  }

  // ML-DSA
  @Get('dsa/demo')
  demonstrateDsa() {
    return this.postQuantum.demonstrateDsa();
  }

  @Post('dsa/keygen')
  dsaKeygen(@Body() dto: DsaKeygenDTO) {
    return this.postQuantum.dsaKeygen(dto.variant);
  }

  @Post('dsa/sign')
  dsaSign(@Body() dto: DsaSignDTO) {
    return this.postQuantum.dsaSign(dto.message, dto.secretKey, dto.variant);
  }

  @Post('dsa/verify')
  dsaVerify(@Body() dto: DsaVerifyDTO) {
    return this.postQuantum.dsaVerify(
      dto.signature,
      dto.message,
      dto.publicKey,
      dto.variant,
    );
  }

  // SLH-DSA
  @Get('slh/demo')
  demonstrateSlh() {
    return this.postQuantum.demonstrateSlh();
  }

  @Post('slh/keygen')
  slhKeygen(@Body() dto: SlhKeygenDTO) {
    return this.postQuantum.slhKeygen(dto.variant);
  }

  @Post('slh/sign')
  slhSign(@Body() dto: SlhSignDTO) {
    return this.postQuantum.slhSign(dto.message, dto.secretKey, dto.variant);
  }

  @Post('slh/verify')
  slhVerify(@Body() dto: SlhVerifyDTO) {
    return this.postQuantum.slhVerify(
      dto.signature,
      dto.message,
      dto.publicKey,
      dto.variant,
    );
  }
}
