import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class ChaCha20EncryptDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  plaintext: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  aad?: string;
}
