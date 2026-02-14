import { IsString, IsNotEmpty, IsOptional, IsObject, IsHexadecimal, MaxLength } from 'class-validator';

export class CreateCertificateDTO {
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  subject?: string;
}

export class VerifyCertificateDTO {
  @IsObject()
  @IsNotEmpty()
  certificate: object;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  signature: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  publicKey: string;
}
