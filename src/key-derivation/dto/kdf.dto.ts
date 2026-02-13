import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class KdfDTO {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  salt?: string;

  @IsOptional()
  @IsNumber()
  iterations?: number;

  @IsOptional()
  @IsNumber()
  keyLength?: number;
}

export class Pbkdf2DTO extends KdfDTO {
  @IsOptional()
  @IsString()
  algorithm?: string;
}

export class ScryptDTO extends KdfDTO {
  @IsOptional()
  @IsNumber()
  N?: number;

  @IsOptional()
  @IsNumber()
  r?: number;

  @IsOptional()
  @IsNumber()
  p?: number;
}
