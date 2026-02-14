import { IsString, IsNotEmpty, IsHexadecimal, MaxLength } from 'class-validator';

export class UnwrapKeyDTO {
  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  wrappedKey: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  kek: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  iv: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  authTag: string;
}
