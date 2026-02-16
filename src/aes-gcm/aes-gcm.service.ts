import { BadRequestException, Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

@Injectable()
export class AesGcmService {
  encrypt(plaintext: string, keyHex?: string) {
    const key = keyHex ? Buffer.from(keyHex, 'hex') : randomBytes(32);
    const iv = randomBytes(12);

    const cipher = createCipheriv(
      'aes-256-gcm',
      new Uint8Array(key),
      new Uint8Array(iv),
    );
    const encrypted =
      cipher.update(plaintext, 'utf8', 'hex') + cipher.final('hex');
    const tag = cipher.getAuthTag();

    return {
      ciphertext: encrypted,
      iv: iv.toString('hex'),
      authTag: tag.toString('hex'),
      key: key.toString('hex'),
      algorithm: 'AES-256-GCM',
    };
  }

  decrypt(
    ciphertext: string,
    keyHex: string,
    ivHex: string,
    authTagHex: string,
  ) {
    try {
      const key = Buffer.from(keyHex, 'hex');
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');

      const decipher = createDecipheriv(
        'aes-256-gcm',
        new Uint8Array(key),
        new Uint8Array(iv),
      );
      decipher.setAuthTag(new Uint8Array(authTag));

      const decrypted =
        decipher.update(ciphertext, 'hex', 'utf8') + decipher.final('utf8');

      return { plaintext: decrypted, algorithm: 'AES-256-GCM' };
    } catch {
      throw new BadRequestException('decryption failed');
    }
  }

  demonstrate() {
    const message =
      'Authenticated encryption provides both confidentiality and integrity';
    const encrypted = this.encrypt(message);
    const decrypted = this.decrypt(
      encrypted.ciphertext,
      encrypted.key,
      encrypted.iv,
      encrypted.authTag,
    );

    let tamperDetected = false;
    try {
      this.decrypt(
        encrypted.ciphertext,
        encrypted.key,
        encrypted.iv,
        randomBytes(16).toString('hex'),
      );
    } catch {
      tamperDetected = true;
    }

    return {
      message: 'AES-GCM: Authenticated Encryption with Associated Data (AEAD)',
      original: message,
      encrypted: {
        ciphertext: encrypted.ciphertext,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
      },
      decrypted: decrypted.plaintext,
      tamperDetected,
      advantage: 'Unlike AES-CBC, GCM detects if ciphertext has been modified',
    };
  }
}
