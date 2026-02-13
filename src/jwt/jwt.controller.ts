import { Body, Controller, Get, Post } from '@nestjs/common';
import { JwtService } from './jwt.service';
import {
  JwtSignHs256DTO,
  JwtSignRs256DTO,
  JwtVerifyDTO,
  JwtDecodeDTO,
} from './dto';

@Controller('jwt')
export class JwtController {
  constructor(private jwt: JwtService) {}

  @Post('sign/hs256')
  signHs256(@Body() dto: JwtSignHs256DTO) {
    return this.jwt.signHs256(dto.payload, dto.secret);
  }

  @Post('sign/rs256')
  signRs256(@Body() dto: JwtSignRs256DTO) {
    return this.jwt.signRs256(dto.payload);
  }

  @Post('verify')
  verify(@Body() dto: JwtVerifyDTO) {
    return this.jwt.verify(dto.token, dto.secretOrPublicKey, dto.algorithm);
  }

  @Post('decode')
  decode(@Body() dto: JwtDecodeDTO) {
    return this.jwt.decode(dto.token);
  }

  @Get('demo')
  demonstrate() {
    return this.jwt.demonstrate();
  }
}
