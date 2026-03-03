import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

@Injectable()
export class ChaCha20Service {
  private readonly logger = new Logger(ChaCha20Service.name);
  private readonly algorithm = 'chacha20-poly1305';
  private readonly keyLength = 32;
  private readonly ivLength = 12;
  private readonly authTagLength = 16;

  encrypt(
    plaintext: string,
    aad?: string,
  ): {
    ciphertext: string;
    key: string;
    iv: string;
    authTag: string;
    aad: string | null;
  } {
    const key = randomBytes(this.keyLength);
    const iv = randomBytes(this.ivLength);

    const cipher = createCipheriv(
      this.algorithm,
      new Uint8Array(key),
      new Uint8Array(iv),
      { authTagLength: this.authTagLength },
    );

    const plaintextBuf = new Uint8Array(Buffer.from(plaintext, 'utf-8'));

    if (aad) {
      cipher.setAAD(new Uint8Array(Buffer.from(aad)), {
        plaintextLength: plaintextBuf.length,
      });
    }

    const encrypted = Buffer.concat([
      cipher.update(plaintextBuf),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return {
      ciphertext: encrypted.toString('hex'),
      key: key.toString('hex'),
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      aad: aad || null,
    };
  }

  decrypt(
    ciphertext: string,
    key: string,
    iv: string,
    authTag: string,
    aad?: string,
  ): { plaintext: string; algorithm: string } {
    try {
      const keyBuf = new Uint8Array(Buffer.from(key, 'hex'));
      const ivBuf = new Uint8Array(Buffer.from(iv, 'hex'));
      const authTagBuf = new Uint8Array(Buffer.from(authTag, 'hex'));
      const ciphertextBuf = new Uint8Array(Buffer.from(ciphertext, 'hex'));

      const decipher = createDecipheriv(this.algorithm, keyBuf, ivBuf, {
        authTagLength: this.authTagLength,
      });

      decipher.setAuthTag(authTagBuf);

      if (aad) {
        decipher.setAAD(new Uint8Array(Buffer.from(aad)), {
          plaintextLength: ciphertextBuf.length,
        });
      }

      const decrypted = Buffer.concat([
        decipher.update(ciphertextBuf),
        decipher.final(),
      ]);

      return {
        plaintext: decrypted.toString('utf-8'),
        algorithm: this.algorithm,
      };
    } catch (error) {
      this.logger.error(`ChaCha20 decryption failed: ${error.message}`);
      if (
        error.message.includes('Unsupported state') ||
        error.message.includes('unable to authenticate')
      ) {
        throw new BadRequestException(
          'authentication failed: ciphertext may have been tampered with',
        );
      }
      throw new BadRequestException(
        'decryption failed: invalid key, IV, or corrupted data',
      );
    }
  }

  demonstrate(): {
    original: string;
    ciphertext: string;
    decrypted: string;
    tamperDetected: boolean;
    algorithm: string;
    description: string;
  } {
    const original =
      'ChaCha20-Poly1305 is a modern AEAD cipher combining the ChaCha20 stream cipher with the Poly1305 authenticator.';

    const encrypted = this.encrypt(original);

    const { plaintext: decrypted } = this.decrypt(
      encrypted.ciphertext,
      encrypted.key,
      encrypted.iv,
      encrypted.authTag,
    );

    let tamperDetected = false;
    try {
      const tamperedCiphertext = Buffer.from(encrypted.ciphertext, 'hex');
      tamperedCiphertext[0] ^= 0xff;
      this.decrypt(
        tamperedCiphertext.toString('hex'),
        encrypted.key,
        encrypted.iv,
        encrypted.authTag,
      );
    } catch {
      tamperDetected = true;
    }

    return {
      original,
      ciphertext: encrypted.ciphertext,
      decrypted,
      tamperDetected,
      algorithm: this.algorithm,
      description:
        'ChaCha20-Poly1305 is an Authenticated Encryption with Associated Data (AEAD) cipher. ' +
        'It combines the ChaCha20 stream cipher for encryption with the Poly1305 message authentication code. ' +
        'It provides both confidentiality and integrity, detecting any tampering with the ciphertext. ' +
        'Widely used in TLS 1.3, WireGuard, and SSH as an alternative to AES-GCM.',
    };
  }
}
