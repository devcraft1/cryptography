import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { SaltsService } from './salts.service';
import { SaltDTO } from './dto';

@Controller('salts')
export class SaltsController {
  constructor(private salts: SaltsService) {}

  @Post('signup')
  @HttpCode(201)
  signUpWithSalt(@Body() dto: SaltDTO) {
    return this.salts.signup(dto.email, dto.password);
  }

  @Post('signin')
  signInWithSalt(@Body() dto: SaltDTO) {
    return this.salts.signin(dto.email, dto.password);
  }
}
