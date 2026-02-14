import { IsString, IsNotEmpty, IsOptional, IsHexadecimal, MaxLength, IsIn } from 'class-validator';

export class KemKeygenDTO {
  @IsOptional()
  @IsIn(['512', '768', '1024'])
  variant?: string;
}

export class KemEncapsulateDTO {
  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  publicKey: string;

  @IsOptional()
  @IsIn(['512', '768', '1024'])
  variant?: string;
}

export class KemDecapsulateDTO {
  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  cipherText: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  secretKey: string;

  @IsOptional()
  @IsIn(['512', '768', '1024'])
  variant?: string;
}

export class DsaKeygenDTO {
  @IsOptional()
  @IsIn(['44', '65', '87'])
  variant?: string;
}

export class DsaSignDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  message: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  secretKey: string;

  @IsOptional()
  @IsIn(['44', '65', '87'])
  variant?: string;
}

export class DsaVerifyDTO {
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

  @IsOptional()
  @IsIn(['44', '65', '87'])
  variant?: string;
}

export class SlhKeygenDTO {
  @IsOptional()
  @IsIn(['128f', '192f', '256f'])
  variant?: string;
}

export class SlhSignDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  message: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  secretKey: string;

  @IsOptional()
  @IsIn(['128f', '192f', '256f'])
  variant?: string;
}

export class SlhVerifyDTO {
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

  @IsOptional()
  @IsIn(['128f', '192f', '256f'])
  variant?: string;
}
