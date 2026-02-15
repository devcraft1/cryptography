import { IsString, IsNotEmpty, IsHexadecimal, MaxLength, MinLength } from 'class-validator';

export class RevealDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  value: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @IsHexadecimal()
  @MaxLength(10000)
  nonce: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @IsHexadecimal()
  @MaxLength(10000)
  commitment: string;
}
