import { IsString, IsNotEmpty, IsHexadecimal, MaxLength } from 'class-validator';

export class SignMessageDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  message: string;
}

export class VerifySignatureDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  message: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  signature: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  publicKey: string;
}
