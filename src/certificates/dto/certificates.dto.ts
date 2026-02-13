import { IsString, IsNotEmpty, IsOptional, IsObject, IsHexadecimal } from 'class-validator';

export class CreateCertificateDTO {
  @IsOptional()
  @IsString()
  subject?: string;
}

export class VerifyCertificateDTO {
  @IsObject()
  @IsNotEmpty()
  certificate: object;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  signature: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  publicKey: string;
}
