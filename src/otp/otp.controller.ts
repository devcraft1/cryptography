import { Body, Controller, Get, Post } from '@nestjs/common';
import { OtpService } from './otp.service';
import {
  OtpSecretDTO,
  HotpGenerateDTO,
  HotpVerifyDTO,
  TotpGenerateDTO,
  TotpVerifyDTO,
} from './dto';

@Controller('otp')
export class OtpController {
  constructor(private otp: OtpService) {}

  @Post('secret')
  generateSecret(@Body() dto: OtpSecretDTO) {
    return this.otp.generateSecret(dto.length);
  }

  @Post('hotp/generate')
  generateHotp(@Body() dto: HotpGenerateDTO) {
    return this.otp.generateHotp(dto.secret, dto.counter);
  }

  @Post('hotp/verify')
  verifyHotp(@Body() dto: HotpVerifyDTO) {
    return this.otp.verifyHotp(dto.otp, dto.secret, dto.counter);
  }

  @Post('totp/generate')
  generateTotp(@Body() dto: TotpGenerateDTO) {
    return this.otp.generateTotp(dto.secret, dto.timeStep);
  }

  @Post('totp/verify')
  verifyTotp(@Body() dto: TotpVerifyDTO) {
    return this.otp.verifyTotp(dto.otp, dto.secret, dto.timeStep, dto.window);
  }

  @Get('demo')
  demonstrate() {
    return this.otp.demonstrate();
  }
}
