import { IsString, IsNotEmpty, IsOptional, IsHexadecimal, MaxLength } from 'class-validator';

export class ChaCha20DecryptDTO {
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

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  aad?: string;
}
