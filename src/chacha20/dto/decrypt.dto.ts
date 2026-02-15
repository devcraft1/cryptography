import { IsString, IsNotEmpty, IsOptional, IsHexadecimal, MaxLength, MinLength } from 'class-validator';

export class ChaCha20DecryptDTO {
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

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  aad?: string;
}
