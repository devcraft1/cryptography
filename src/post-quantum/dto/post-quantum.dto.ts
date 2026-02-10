export class KemKeygenDTO {
  variant?: string;
}

export class KemEncapsulateDTO {
  publicKey: string;
  variant?: string;
}

export class KemDecapsulateDTO {
  cipherText: string;
  secretKey: string;
  variant?: string;
}

export class DsaKeygenDTO {
  variant?: string;
}

export class DsaSignDTO {
  message: string;
  secretKey: string;
  variant?: string;
}

export class DsaVerifyDTO {
  message: string;
  signature: string;
  publicKey: string;
  variant?: string;
}

export class SlhKeygenDTO {
  variant?: string;
}

export class SlhSignDTO {
  message: string;
  secretKey: string;
  variant?: string;
}

export class SlhVerifyDTO {
  message: string;
  signature: string;
  publicKey: string;
  variant?: string;
}
