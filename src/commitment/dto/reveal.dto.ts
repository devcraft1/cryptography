import { IsString, IsNotEmpty, IsHexadecimal } from 'class-validator';

export class RevealDTO {
  @IsString()
  @IsNotEmpty()
  value: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  nonce: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  commitment: string;
}
