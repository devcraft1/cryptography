import { IsString, IsNotEmpty, IsHexadecimal } from 'class-validator';

export class SignBlindDTO {
  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  blindedMessage: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  privateKeyD: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  publicKeyN: string;
}
