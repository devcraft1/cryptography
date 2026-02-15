import { IsString, IsNotEmpty, IsOptional, IsHexadecimal, MaxLength, MinLength } from 'class-validator';

export class WrapKeyDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @IsHexadecimal()
  @MaxLength(10000)
  keyToWrap: string;

  @IsOptional()
  @MinLength(2)
  @IsString()
  @IsHexadecimal()
  @MaxLength(10000)
  kek?: string;
}
