import { IsString, IsNotEmpty, IsHexadecimal } from 'class-validator';

export class HybridDecryptDTO {
  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  encryptedKey: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  ciphertext: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  iv: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  authTag: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  privateKey: string;
}
