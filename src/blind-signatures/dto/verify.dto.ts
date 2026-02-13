import { IsString, IsNotEmpty, IsHexadecimal } from 'class-validator';

export class VerifyBlindDTO {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  signature: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  publicKeyN: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  publicKeyE: string;
}
