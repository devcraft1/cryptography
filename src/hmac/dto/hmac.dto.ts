import { IsString, IsNotEmpty, IsHexadecimal, MaxLength } from 'class-validator';

export class HmacDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  message: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  key: string;
}

export class HmacVerifyDTO extends HmacDTO {
  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  expectedHmac: string;
}
