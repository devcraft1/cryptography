export class ChaCha20DecryptDTO {
  ciphertext: string;
  key: string;
  iv: string;
  authTag: string;
  aad?: string;
}
