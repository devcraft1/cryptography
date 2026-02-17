import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsHexadecimal, MaxLength, MinLength, Min, Max, ArrayMinSize, ArrayMaxSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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

export class ShareItemDTO {
  @IsNumber()
  @Min(0)
  @Max(255)
  index: number;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MinLength(2)
  @MaxLength(10000)
  data: string;
}

export class CombineSharesDTO {
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(2)
  @ArrayMaxSize(10000)
  @ValidateNested({ each: true })
  @Type(() => ShareItemDTO)
  shares: ShareItemDTO[];
}
