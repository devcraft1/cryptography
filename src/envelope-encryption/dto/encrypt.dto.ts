import { IsString, IsNotEmpty, IsOptional, IsHexadecimal } from 'class-validator';

export class EnvelopeEncryptDTO {
  @IsString()
  @IsNotEmpty()
  plaintext: string;

  @IsOptional()
  @IsString()
  @IsHexadecimal()
  masterKey?: string;
}
