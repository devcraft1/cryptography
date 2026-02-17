import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ZkpService } from './zkp.service';
import { CreateCommitmentDTO, CreateResponseDTO, VerifyProofDTO } from './dto';

@ApiTags('ZKP')
@Controller('zkp')
export class ZkpController {
  constructor(private zkpService: ZkpService) {}

  @Post('commitment')
  createCommitment(@Body() dto: CreateCommitmentDTO) {
    return this.zkpService.createCommitment(dto.secret);
  }

  @Get('challenge')
  createChallenge() {
    return this.zkpService.createChallenge();
  }

  @Post('response')
  createResponse(@Body() dto: CreateResponseDTO) {
    return this.zkpService.createResponse(dto.secret, dto.k, dto.challenge);
  }

  @Post('verify')
  verify(@Body() dto: VerifyProofDTO) {
    return this.zkpService.verify(
      dto.publicValue,
      dto.commitment,
      dto.challenge,
      dto.response,
    );
  }

  @Get('demo')
  demonstrate() {
    return this.zkpService.demonstrate();
  }
}
