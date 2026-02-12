export class HybridDecryptDTO {
  encryptedKey: string;
  ciphertext: string;
  iv: string;
  authTag: string;
  privateKey: string;
}
