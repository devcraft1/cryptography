import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class HashDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(5000)
  input: string;
}
