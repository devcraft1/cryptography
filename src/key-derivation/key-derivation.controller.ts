import { Body, Controller, Get, Post } from '@nestjs/common';
import { KeyDerivationService } from './key-derivation.service';
import { KdfDTO, VerifyDerivedKeyDTO } from './dto';

@Controller('kdf')
export class KeyDerivationController {
  constructor(private keyDerivation: KeyDerivationService) {}

  @Post('pbkdf2')
  derivePbkdf2(@Body() dto: KdfDTO) {
    return this.keyDerivation.pbkdf2(
      dto.password,
      dto.salt,
      dto.iterations,
      dto.keyLength,
    );
  }

  @Post('scrypt')
  deriveScrypt(@Body() dto: KdfDTO) {
    return this.keyDerivation.scrypt(dto.password, dto.salt, dto.keyLength);
  }

  @Get('demo')
  demonstrateKdf() {
    return this.keyDerivation.demonstrateKdf();
  }

  @Post('verify')
  verifyDerivedKey(
    @Body()
    dto: VerifyDerivedKeyDTO,
  ) {
    return {
      isValid: this.keyDerivation.verifyPassword(
        dto.password,
        dto.salt,
        dto.storedKey,
        dto.method,
      ),
    };
  }
}
