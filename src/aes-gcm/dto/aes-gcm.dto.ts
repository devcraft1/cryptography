import { IsString, IsNotEmpty, IsOptional, IsHexadecimal, MaxLength } from 'class-validator';

export class AesGcmEncryptDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  plaintext: string;

  @IsOptional()
  @IsString()
  @IsHexadecimal()
  @MaxLength(10000)
  key?: string;
}

export class AesGcmDecryptDTO {
  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  ciphertext: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  key: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  iv: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  authTag: string;
}
