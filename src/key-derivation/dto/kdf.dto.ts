import { IsString, IsNotEmpty, IsOptional, IsNumber, MaxLength, Min, Max, IsIn } from 'class-validator';

export class KdfDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  salt?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000000)
  iterations?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(512)
  keyLength?: number;
}

export class Pbkdf2DTO extends KdfDTO {
  @IsOptional()
  @IsIn(['sha256', 'sha512', 'sha384', 'sha1', 'md5'])
  algorithm?: string;
}

export class ScryptDTO extends KdfDTO {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1048576)
  N?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(64)
  r?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(64)
  p?: number;
}
