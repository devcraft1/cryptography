import { IsString, IsNotEmpty, IsHexadecimal } from 'class-validator';

export class HybridEncryptDTO {
  @IsString()
  @IsNotEmpty()
  plaintext: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  publicKey: string;
}
