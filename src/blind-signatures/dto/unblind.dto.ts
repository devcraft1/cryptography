import { IsString, IsNotEmpty, IsHexadecimal } from 'class-validator';

export class UnblindDTO {
  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  blindedSignature: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  blindingFactor: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  publicKeyN: string;
}
