import { IsString, IsNotEmpty, IsHexadecimal, MaxLength, MinLength } from 'class-validator';

export class SignBlindDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @IsHexadecimal()
  @MaxLength(10000)
  blindedMessage: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @IsHexadecimal()
  @MaxLength(10000)
  privateKeyD: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @IsHexadecimal()
  @MaxLength(10000)
  publicKeyN: string;
}
