import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class HashDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(10000)
  input: string;
}
