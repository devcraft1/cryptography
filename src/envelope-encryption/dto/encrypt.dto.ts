import { IsString, IsNotEmpty, IsOptional, IsHexadecimal, MaxLength, MinLength } from 'class-validator';

export class EnvelopeEncryptDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  plaintext: string;

  @IsOptional()
  @MinLength(2)
  @IsString()
  @IsHexadecimal()
  @MaxLength(10000)
  masterKey?: string;
}
