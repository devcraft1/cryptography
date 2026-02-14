import { IsString, IsNotEmpty, IsOptional, IsHexadecimal, MaxLength } from 'class-validator';

export class EnvelopeEncryptDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  plaintext: string;

  @IsOptional()
  @IsString()
  @IsHexadecimal()
  @MaxLength(10000)
  masterKey?: string;
}
