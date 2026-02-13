import { IsString, IsNotEmpty, IsHexadecimal } from 'class-validator';

export class CreateResponseDTO {
  @IsString()
  @IsNotEmpty()
  secret: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  k: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  challenge: string;
}
