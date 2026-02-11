export class OtpSecretDTO {
  length?: number;
}

export class HotpGenerateDTO {
  secret: string;
  counter: number;
}

export class HotpVerifyDTO {
  otp: string;
  secret: string;
  counter: number;
}

export class TotpGenerateDTO {
  secret: string;
  timeStep?: number;
}

export class TotpVerifyDTO {
  otp: string;
  secret: string;
  timeStep?: number;
  window?: number;
}
