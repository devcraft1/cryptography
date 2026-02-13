import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class HkdfDeriveDTO {
  @IsString()
  @IsNotEmpty()
  ikm: string;

  @IsOptional()
  @IsString()
  salt?: string;

  @IsOptional()
  @IsString()
  info?: string;

  @IsOptional()
  @IsNumber()
  keyLength?: number;

  @IsOptional()
  @IsString()
  hash?: string;
}
