import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class EncodingDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  input: string;
}

export class DecodeDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  encoded: string;
}
