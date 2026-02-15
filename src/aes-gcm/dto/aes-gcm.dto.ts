import { IsString, IsNotEmpty, IsOptional, IsHexadecimal, MaxLength, MinLength } from 'class-validator';

export class AesGcmEncryptDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  plaintext: string;

  @IsOptional()
  @MinLength(2)
  @IsString()
  @IsHexadecimal()
  @MaxLength(10000)
  key?: string;
}

export class AesGcmDecryptDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @IsHexadecimal()
  @MaxLength(10000)
  ciphertext: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @IsHexadecimal()
  @MaxLength(10000)
  key: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @IsHexadecimal()
  @MaxLength(10000)
  iv: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @IsHexadecimal()
  @MaxLength(10000)
  authTag: string;
}
