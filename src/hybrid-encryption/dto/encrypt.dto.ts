import { IsString, IsNotEmpty, IsHexadecimal, MaxLength, MinLength } from 'class-validator';

export class HybridEncryptDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  plaintext: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @IsHexadecimal()
  @MaxLength(10000)
  publicKey: string;
}
