import { IsString, IsNotEmpty, IsHexadecimal } from 'class-validator';

export class BlindDTO {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  publicKeyN: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  publicKeyE: string;
}
