import { IsString, IsNotEmpty, IsHexadecimal, MaxLength } from 'class-validator';

export class RevealDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  value: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  nonce: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  commitment: string;
}
