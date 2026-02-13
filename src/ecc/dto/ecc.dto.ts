import { IsString, IsNotEmpty, IsOptional, IsHexadecimal } from 'class-validator';

export class EccKeygenDTO {
  @IsOptional()
  @IsString()
  curve?: string;
}

export class EccSignDTO {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsString()
  @IsHexadecimal()
  privateKey?: string;
}

export class EccVerifyDTO {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  signature: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  publicKey: string;
}
