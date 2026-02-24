import { IsString, IsNotEmpty, IsOptional, IsObject, MaxLength, IsIn, ValidateNested } from 'class-validator';

export class JwtSignHs256DTO {
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  payload: object;

  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  secret: string;
}

export class JwtSignRs256DTO {
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  payload: object;
}

export class JwtVerifyDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(8192)
  token: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(4096)
  secretOrPublicKey: string;

  @IsOptional()
  @IsIn(['HS256', 'RS256'])
  algorithm?: string;
}

export class JwtDecodeDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(8192)
  token: string;
}
