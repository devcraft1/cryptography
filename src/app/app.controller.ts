import { Body, Controller, Get, Post } from '@nestjs/common';
import { SaltsService } from 'src/salts/salts.service';
import { SaltDTO } from 'src/salts/dto';

@Controller('app')
export class AppController {
  constructor(private salts: SaltsService) {}

  @Post('salts/signup')
  signUpwithSalt(@Body() dto: SaltDTO) {
    return this.salts.signup(dto.email, dto.password);
  }
}
