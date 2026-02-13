import { IsString, IsNotEmpty, IsOptional, IsHexadecimal } from 'class-validator';

export class ChaCha20DecryptDTO {
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

  @IsOptional()
  @IsString()
  aad?: string;
}
