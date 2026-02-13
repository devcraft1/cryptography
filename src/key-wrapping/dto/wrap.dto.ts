import { IsString, IsNotEmpty, IsOptional, IsHexadecimal } from 'class-validator';

export class WrapKeyDTO {
  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  keyToWrap: string;

  @IsOptional()
  @IsString()
  @IsHexadecimal()
  kek?: string;
}
