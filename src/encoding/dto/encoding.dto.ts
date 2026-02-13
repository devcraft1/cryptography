import { IsString, IsNotEmpty } from 'class-validator';

export class EncodingDTO {
  @IsString()
  @IsNotEmpty()
  input: string;
}

export class DecodeDTO {
  @IsString()
  @IsNotEmpty()
  encoded: string;
}
