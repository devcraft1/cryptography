import { IsString, IsNotEmpty, IsHexadecimal, MaxLength } from 'class-validator';

export class BlindDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  message: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  publicKeyN: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  publicKeyE: string;
}
