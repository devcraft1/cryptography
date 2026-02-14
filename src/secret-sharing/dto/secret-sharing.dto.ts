import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, MaxLength, Min, Max, ArrayMaxSize } from 'class-validator';

export class SplitSecretDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  secret: string;

  @IsOptional()
  @IsNumber()
  @Min(2)
  @Max(255)
  totalShares?: number;

  @IsOptional()
  @IsNumber()
  @Min(2)
  @Max(255)
  threshold?: number;
}

export class CombineSharesDTO {
  @IsArray()
  @IsNotEmpty()
  @ArrayMaxSize(10000)
  shares: { index: number; data: string }[];
}
