import { IsString, IsNotEmpty, IsHexadecimal, MaxLength } from 'class-validator';

export class VerifyProofDTO {
  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  publicValue: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  commitment: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  challenge: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  response: string;
}
