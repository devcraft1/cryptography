import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class HybridEncryptionService {
  generateKeyPair(): { publicKey: string; privateKey: string } {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    return { publicKey, privateKey };
  }

  encrypt(
    plaintext: string,
    publicKeyPem: string,
  ): {
    encryptedKey: string;
    ciphertext: string;
    iv: string;
    authTag: string;
    algorithm: string;
  } {
    const aesKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(
      'aes-256-gcm',
      new Uint8Array(aesKey),
      new Uint8Array(iv),
    );
    const ciphertext =
      cipher.update(plaintext, 'utf8', 'hex') + cipher.final('hex');
    const authTag = cipher.getAuthTag();

    const encryptedKey = crypto.publicEncrypt(
      {
        key: publicKeyPem,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      aesKey,
    );

    return {
      encryptedKey: encryptedKey.toString('hex'),
      ciphertext,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      algorithm: 'RSA-OAEP + AES-256-GCM',
    };
  }

  decrypt(
    encryptedKey: string,
    ciphertext: string,
    iv: string,
    authTag: string,
    privateKeyPem: string,
  ): { plaintext: string; algorithm: string } {
    const aesKey = crypto.privateDecrypt(
      {
        key: privateKeyPem,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(encryptedKey, 'hex'),
    );

    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      new Uint8Array(aesKey),
      new Uint8Array(Buffer.from(iv, 'hex')),
    );
    decipher.setAuthTag(new Uint8Array(Buffer.from(authTag, 'hex')));

    const plaintext =
      decipher.update(ciphertext, 'hex', 'utf8') + decipher.final('utf8');

    return { plaintext, algorithm: 'RSA-OAEP + AES-256-GCM' };
  }

  demonstrate() {
    const original = 'Hybrid encryption combines RSA key exchange with AES bulk encryption';
    const { publicKey, privateKey } = this.generateKeyPair();

    const encrypted = this.encrypt(original, publicKey);
    const decrypted = this.decrypt(
      encrypted.encryptedKey,
      encrypted.ciphertext,
      encrypted.iv,
      encrypted.authTag,
      privateKey,
    );

    return {
      publicKey,
      encryptedKey: encrypted.encryptedKey,
      ciphertext: encrypted.ciphertext,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
      decrypted: decrypted.plaintext,
      original,
      match: decrypted.plaintext === original,
      algorithm: 'RSA-OAEP + AES-256-GCM',
      description:
        'Hybrid encryption uses RSA to encrypt a random AES key, then AES-256-GCM to encrypt the actual data. This combines the key exchange strength of RSA with the performance of symmetric encryption.',
    };
  }
}
