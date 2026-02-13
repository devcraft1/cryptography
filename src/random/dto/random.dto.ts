import { IsOptional, IsNumber } from 'class-validator';

export class RandomBytesDTO {
  @IsOptional()
  @IsNumber()
  size?: number;
}

export class RandomIntDTO {
  @IsOptional()
  @IsNumber()
  min?: number;

  @IsOptional()
  @IsNumber()
  max?: number;
}
