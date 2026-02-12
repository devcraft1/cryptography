import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommitmentService } from './commitment.service';
import { CommitDTO, RevealDTO } from './dto';

@Controller('commitment')
export class CommitmentController {
  constructor(private commitment: CommitmentService) {}

  @Post('commit')
  commit(@Body() dto: CommitDTO) {
    return this.commitment.commit(dto.value);
  }

  @Post('verify')
  verify(@Body() dto: RevealDTO) {
    return this.commitment.verify(dto.value, dto.nonce, dto.commitment);
  }

  @Get('demo')
  demonstrate() {
    return this.commitment.demonstrate();
  }
}
