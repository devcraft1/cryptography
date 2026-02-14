import { IsString, IsNotEmpty, IsEmail, MinLength, MaxLength } from 'class-validator';

export class SaltDTO {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(10000)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(10000)
  password: string;
}
