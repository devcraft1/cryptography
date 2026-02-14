import { IsString, IsNotEmpty, IsHexadecimal, MaxLength } from 'class-validator';

export class HybridEncryptDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  plaintext: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  publicKey: string;
}
