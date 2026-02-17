import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChaCha20Service } from './chacha20.service';
import { ChaCha20EncryptDTO, ChaCha20DecryptDTO } from './dto';

@ApiTags('ChaCha20')
@Controller('chacha20')
export class ChaCha20Controller {
  constructor(private chacha20: ChaCha20Service) {}

  @Post('encrypt')
  encrypt(@Body() dto: ChaCha20EncryptDTO) {
    return this.chacha20.encrypt(dto.plaintext, dto.aad);
  }

  @Post('decrypt')
  decrypt(@Body() dto: ChaCha20DecryptDTO) {
    return this.chacha20.decrypt(
      dto.ciphertext,
      dto.key,
      dto.iv,
      dto.authTag,
      dto.aad,
    );
  }

  @Get('demo')
  demo() {
    return this.chacha20.demonstrate();
  }
}
