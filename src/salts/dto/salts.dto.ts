import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class SaltDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  password: string;
}
