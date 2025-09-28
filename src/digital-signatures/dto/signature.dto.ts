export class SignMessageDTO {
  message: string;
}

export class VerifySignatureDTO {
  message: string;
  signature: string;
  publicKey: string;
}