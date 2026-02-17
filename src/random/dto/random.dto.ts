import { IsOptional, IsNumber, IsInt, Min, Max } from 'class-validator';

export class RandomBytesDTO {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1024)
  size?: number;
}

export class RandomIntDTO {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(2147483647)
  min?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(2147483647)
  max?: number;
}
