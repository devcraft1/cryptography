import { IsString, IsNotEmpty, IsOptional, IsNumber, MaxLength, Min, Max, IsIn } from 'class-validator';

export class HkdfDeriveDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  ikm: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  salt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  info?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(512)
  keyLength?: number;

  @IsOptional()
  @IsIn(['sha256', 'sha512', 'sha384', 'sha1', 'md5'])
  hash?: string;
}
