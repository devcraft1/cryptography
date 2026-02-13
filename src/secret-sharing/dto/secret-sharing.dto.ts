import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';

export class SplitSecretDTO {
  @IsString()
  @IsNotEmpty()
  secret: string;

  @IsOptional()
  @IsNumber()
  totalShares?: number;

  @IsOptional()
  @IsNumber()
  threshold?: number;
}

export class CombineSharesDTO {
  @IsArray()
  @IsNotEmpty()
  shares: { index: number; data: string }[];
}
