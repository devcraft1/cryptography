import { IsString, IsNotEmpty, IsHexadecimal, MaxLength, MinLength } from 'class-validator';

export class HmacDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  message: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @IsHexadecimal()
  @MaxLength(512)
  key: string;
}

export class HmacVerifyDTO extends HmacDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @IsHexadecimal()
  @MaxLength(128)
  expectedHmac: string;
}
