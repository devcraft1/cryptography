export class EccKeygenDTO {
  curve?: string;
}

export class EccSignDTO {
  message: string;
  privateKey?: string;
}

export class EccVerifyDTO {
  message: string;
  signature: string;
  publicKey: string;
}
