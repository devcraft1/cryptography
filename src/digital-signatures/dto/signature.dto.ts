import { IsString, IsNotEmpty, IsHexadecimal, MaxLength, MinLength } from 'class-validator';

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
  @MinLength(2)
  @IsHexadecimal()
  @MaxLength(10000)
  signature: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @IsHexadecimal()
  @MaxLength(10000)
  publicKey: string;
}
