import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EncodingService } from './encoding.service';
import { EncodingDTO, DecodeDTO } from './dto';

@ApiTags('Encoding')
@Controller('encoding')
export class EncodingController {
  constructor(private encoding: EncodingService) {}

  @Post('base64/encode')
  base64Encode(@Body() dto: EncodingDTO) {
    return this.encoding.base64Encode(dto.input);
  }

  @Post('base64/decode')
  base64Decode(@Body() dto: DecodeDTO) {
    return this.encoding.base64Decode(dto.encoded);
  }

  @Post('hex/encode')
  hexEncode(@Body() dto: EncodingDTO) {
    return this.encoding.hexEncode(dto.input);
  }

  @Post('hex/decode')
  hexDecode(@Body() dto: DecodeDTO) {
    return this.encoding.hexDecode(dto.encoded);
  }

  @Post('url/encode')
  urlEncode(@Body() dto: EncodingDTO) {
    return this.encoding.urlEncode(dto.input);
  }

  @Post('url/decode')
  urlDecode(@Body() dto: DecodeDTO) {
    return this.encoding.urlDecode(dto.encoded);
  }

  @Get('demo')
  demonstrate() {
    return this.encoding.demonstrate();
  }
}
