import { Body, Controller, Get, Post } from '@nestjs/common';
import { CertificatesService, Certificate } from './certificates.service';
import { CreateCertificateDTO, VerifyCertificateDTO } from './dto';

@Controller('certificates')
export class CertificatesController {
  constructor(private certificates: CertificatesService) {}

  @Post('create')
  createSelfSigned(@Body() dto: CreateCertificateDTO) {
    return this.certificates.createSelfSigned(dto.subject);
  }

  @Post('verify')
  verifyCertificate(@Body() dto: VerifyCertificateDTO) {
    return this.certificates.verifyCertificate(
      dto.certificate as Certificate,
      dto.signature,
      dto.publicKey,
    );
  }

  @Get('demo')
  demonstrate() {
    return this.certificates.demonstrate();
  }
}
