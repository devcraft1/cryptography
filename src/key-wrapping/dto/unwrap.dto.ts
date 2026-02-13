import { IsString, IsNotEmpty, IsHexadecimal } from 'class-validator';

export class UnwrapKeyDTO {
  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  wrappedKey: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  kek: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  iv: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  authTag: string;
}
