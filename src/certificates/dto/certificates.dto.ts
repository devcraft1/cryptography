import { IsString, IsNotEmpty, IsOptional, IsObject, IsHexadecimal, MaxLength, MinLength } from 'class-validator';

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
  @MinLength(2)
  @IsHexadecimal()
  @MaxLength(10000)
  signature: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @IsHexadecimal()
  @MaxLength(10000)
  publicKey: string;
}
