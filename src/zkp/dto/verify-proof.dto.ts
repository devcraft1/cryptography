import { IsString, IsNotEmpty, IsHexadecimal } from 'class-validator';

export class VerifyProofDTO {
  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  publicValue: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  commitment: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  challenge: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  response: string;
}
