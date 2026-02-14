import { IsString, IsNotEmpty, IsOptional, IsNumber, MaxLength, Min, Max } from 'class-validator';

export class OtpSecretDTO {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(256)
  length?: number;
}

export class HotpGenerateDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  secret: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(2147483647)
  counter: number;
}

export class HotpVerifyDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  otp: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  secret: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(2147483647)
  counter: number;
}

export class TotpGenerateDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  secret: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(300)
  timeStep?: number;
}

export class TotpVerifyDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  otp: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  secret: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(300)
  timeStep?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(60)
  window?: number;
}
