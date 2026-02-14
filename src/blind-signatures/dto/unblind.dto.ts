import { IsString, IsNotEmpty, IsHexadecimal, MaxLength } from 'class-validator';

export class UnblindDTO {
  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  blindedSignature: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  blindingFactor: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  publicKeyN: string;
}
