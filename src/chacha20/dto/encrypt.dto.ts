import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ChaCha20EncryptDTO {
  @IsString()
  @IsNotEmpty()
  plaintext: string;

  @IsOptional()
  @IsString()
  aad?: string;
}
