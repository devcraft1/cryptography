import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class OtpSecretDTO {
  @IsOptional()
  @IsNumber()
  length?: number;
}

export class HotpGenerateDTO {
  @IsString()
  @IsNotEmpty()
  secret: string;

  @IsNumber()
  @IsNotEmpty()
  counter: number;
}

export class HotpVerifyDTO {
  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsString()
  @IsNotEmpty()
  secret: string;

  @IsNumber()
  @IsNotEmpty()
  counter: number;
}

export class TotpGenerateDTO {
  @IsString()
  @IsNotEmpty()
  secret: string;

  @IsOptional()
  @IsNumber()
  timeStep?: number;
}

export class TotpVerifyDTO {
  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsString()
  @IsNotEmpty()
  secret: string;

  @IsOptional()
  @IsNumber()
  timeStep?: number;

  @IsOptional()
  @IsNumber()
  window?: number;
}
