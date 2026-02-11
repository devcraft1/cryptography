export class AesGcmEncryptDTO {
  plaintext: string;
  key?: string;
}

export class AesGcmDecryptDTO {
  ciphertext: string;
  key: string;
  iv: string;
  authTag: string;
}
