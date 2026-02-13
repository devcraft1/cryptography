import { IsString, IsNotEmpty, IsOptional, IsHexadecimal } from 'class-validator';

export class KemKeygenDTO {
  @IsOptional()
  @IsString()
  variant?: string;
}

export class KemEncapsulateDTO {
  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  publicKey: string;

  @IsOptional()
  @IsString()
  variant?: string;
}

export class KemDecapsulateDTO {
  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  cipherText: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  secretKey: string;

  @IsOptional()
  @IsString()
  variant?: string;
}

export class DsaKeygenDTO {
  @IsOptional()
  @IsString()
  variant?: string;
}

export class DsaSignDTO {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  secretKey: string;

  @IsOptional()
  @IsString()
  variant?: string;
}

export class DsaVerifyDTO {
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

  @IsOptional()
  @IsString()
  variant?: string;
}

export class SlhKeygenDTO {
  @IsOptional()
  @IsString()
  variant?: string;
}

export class SlhSignDTO {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  secretKey: string;

  @IsOptional()
  @IsString()
  variant?: string;
}

export class SlhVerifyDTO {
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

  @IsOptional()
  @IsString()
  variant?: string;
}
