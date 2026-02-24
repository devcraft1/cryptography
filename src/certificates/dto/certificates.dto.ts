import { IsString, IsNotEmpty, IsOptional, IsObject, IsHexadecimal, MaxLength, MinLength } from 'class-validator';
import { ValidateNested } from 'class-validator';

export class CreateCertificateDTO {
  @IsOptional()
  @IsString()
  @MaxLength(256)
  subject?: string;
}

export class VerifyCertificateDTO {
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  certificate: object;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @IsHexadecimal()
  @MaxLength(2048)
  signature: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(2048)
  publicKey: string;
}
