import { Body, Controller, Get, Post } from '@nestjs/common';
import { SecretSharingService } from './secret-sharing.service';
import { SplitSecretDTO, CombineSharesDTO } from './dto';

@Controller('secret-sharing')
export class SecretSharingController {
  constructor(private secretSharing: SecretSharingService) {}

  @Post('split')
  split(@Body() dto: SplitSecretDTO) {
    return this.secretSharing.split(
      dto.secret,
      dto.totalShares,
      dto.threshold,
    );
  }

  @Post('combine')
  combine(@Body() dto: CombineSharesDTO) {
    return this.secretSharing.combine(dto.shares);
  }

  @Get('demo')
  demonstrate() {
    return this.secretSharing.demonstrate();
  }
}
