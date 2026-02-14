import { IsString, IsNotEmpty, IsOptional, IsHexadecimal, MaxLength, IsIn } from 'class-validator';

export class EccKeygenDTO {
  @IsOptional()
  @IsIn(['P-256', 'P-384', 'P-521', 'secp256k1'])
  curve?: string;
}

export class EccSignDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  message: string;

  @IsOptional()
  @IsString()
  @IsHexadecimal()
  @MaxLength(10000)
  privateKey?: string;
}

export class EccVerifyDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  message: string;

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
