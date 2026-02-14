import { IsString, IsNotEmpty, IsHexadecimal, MaxLength } from 'class-validator';

export class SignBlindDTO {
  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  blindedMessage: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  privateKeyD: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  publicKeyN: string;
}
