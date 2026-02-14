import { IsString, IsNotEmpty, IsHexadecimal, MaxLength } from 'class-validator';

export class HybridDecryptDTO {
  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  encryptedKey: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  ciphertext: string;

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

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  privateKey: string;
}
