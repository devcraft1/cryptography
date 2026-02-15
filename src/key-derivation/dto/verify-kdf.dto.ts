import { IsString, IsNotEmpty, IsHexadecimal, MaxLength, MinLength, IsIn } from 'class-validator';

export class VerifyDerivedKeyDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MinLength(2)
  @MaxLength(10000)
  salt: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MinLength(2)
  @MaxLength(10000)
  storedKey: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['pbkdf2', 'scrypt'])
  method: 'pbkdf2' | 'scrypt';
}
