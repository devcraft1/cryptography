import { IsString, IsNotEmpty, IsOptional, IsHexadecimal } from 'class-validator';

export class AesGcmEncryptDTO {
  @IsString()
  @IsNotEmpty()
  plaintext: string;

  @IsOptional()
  @IsString()
  @IsHexadecimal()
  key?: string;
}

export class AesGcmDecryptDTO {
  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  ciphertext: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  key: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  iv: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  authTag: string;
}
