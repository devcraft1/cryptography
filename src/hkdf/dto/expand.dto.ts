import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, MaxLength, Min, Max, ArrayMaxSize, IsIn } from 'class-validator';

export class HkdfExpandDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  ikm: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  salt?: string;

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  @ArrayMaxSize(10000)
  labels: string[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(512)
  keyLength?: number;

  @IsOptional()
  @IsIn(['sha256', 'sha512', 'sha384'])
  hash?: string;
}
