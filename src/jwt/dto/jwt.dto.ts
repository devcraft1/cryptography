export class JwtSignHs256DTO {
  payload: object;
  secret: string;
}

export class JwtSignRs256DTO {
  payload: object;
}

export class JwtVerifyDTO {
  token: string;
  secretOrPublicKey: string;
  algorithm?: string;
}

export class JwtDecodeDTO {
  token: string;
}
