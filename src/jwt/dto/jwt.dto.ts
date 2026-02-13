import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class JwtSignHs256DTO {
  @IsObject()
  @IsNotEmpty()
  payload: object;

  @IsString()
  @IsNotEmpty()
  secret: string;
}

export class JwtSignRs256DTO {
  @IsObject()
  @IsNotEmpty()
  payload: object;
}

export class JwtVerifyDTO {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  secretOrPublicKey: string;

  @IsOptional()
  @IsString()
  algorithm?: string;
}

export class JwtDecodeDTO {
  @IsString()
  @IsNotEmpty()
  token: string;
}
