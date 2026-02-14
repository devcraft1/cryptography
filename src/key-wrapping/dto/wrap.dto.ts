import { IsString, IsNotEmpty, IsOptional, IsHexadecimal, MaxLength } from 'class-validator';

export class WrapKeyDTO {
  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  keyToWrap: string;

  @IsOptional()
  @IsString()
  @IsHexadecimal()
  @MaxLength(10000)
  kek?: string;
}
