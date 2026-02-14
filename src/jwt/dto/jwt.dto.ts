import { IsString, IsNotEmpty, IsOptional, IsObject, MaxLength, IsIn } from 'class-validator';

export class JwtSignHs256DTO {
  @IsObject()
  @IsNotEmpty()
  payload: object;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
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
  @MaxLength(10000)
  token: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  secretOrPublicKey: string;

  @IsOptional()
  @IsIn(['HS256', 'RS256'])
  algorithm?: string;
}

export class JwtDecodeDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  token: string;
}
