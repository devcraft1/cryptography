import { IsString, IsNotEmpty, IsHexadecimal } from 'class-validator';

export class HmacDTO {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  key: string;
}

export class HmacVerifyDTO extends HmacDTO {
  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  expectedHmac: string;
}
