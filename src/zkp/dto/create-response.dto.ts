import { IsString, IsNotEmpty, IsHexadecimal, MaxLength } from 'class-validator';

export class CreateResponseDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  secret: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  k: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  challenge: string;
}
