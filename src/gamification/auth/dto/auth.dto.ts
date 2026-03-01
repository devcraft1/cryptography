import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'agent@ciphervault.io' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'cipher_agent' })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @ApiProperty({ example: 'SecureP@ss123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Agent Smith', required: false })
  @IsString()
  displayName?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'agent@ciphervault.io' })
  @IsString()
  emailOrUsername: string;

  @ApiProperty({ example: 'SecureP@ss123' })
  @IsString()
  password: string;
}
