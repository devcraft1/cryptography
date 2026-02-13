import { IsString, IsNotEmpty, IsHexadecimal } from 'class-validator';

export class SignMessageDTO {
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class VerifySignatureDTO {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  signature: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  publicKey: string;
}
