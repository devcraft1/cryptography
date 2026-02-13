import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';

export class HkdfExpandDTO {
  @IsString()
  @IsNotEmpty()
  ikm: string;

  @IsOptional()
  @IsString()
  salt?: string;

  @IsArray()
  @IsNotEmpty()
  labels: string[];

  @IsOptional()
  @IsNumber()
  keyLength?: number;

  @IsOptional()
  @IsString()
  hash?: string;
}
