export class CreateCertificateDTO {
  subject?: string;
}

export class VerifyCertificateDTO {
  certificate: object;
  signature: string;
  publicKey: string;
}
