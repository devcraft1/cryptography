import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { KeyWrappingService } from './key-wrapping.service';
import { WrapKeyDTO, UnwrapKeyDTO } from './dto';

@ApiTags('Key Wrapping')
@Controller('key-wrap')
export class KeyWrappingController {
  constructor(private keyWrapping: KeyWrappingService) {}

  @Get('generate-kek')
  generateKek() {
    return this.keyWrapping.generateKek();
  }

  @Get('generate-data-key')
  generateDataKey() {
    return this.keyWrapping.generateDataKey();
  }

  @Post('wrap')
  wrap(@Body() dto: WrapKeyDTO) {
    return this.keyWrapping.wrap(dto.keyToWrap, dto.kek);
  }

  @Post('unwrap')
  unwrap(@Body() dto: UnwrapKeyDTO) {
    return this.keyWrapping.unwrap(
      dto.wrappedKey,
      dto.kek,
      dto.iv,
      dto.authTag,
    );
  }

  @Get('demo')
  demonstrate() {
    return this.keyWrapping.demonstrate();
  }
}
