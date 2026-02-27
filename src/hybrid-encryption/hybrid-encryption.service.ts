import { BadRequestException, Injectable } from '@nestjs/common';
import {
  generateKeyPairSync,
  generateKeyPair,
  publicEncrypt,
  privateDecrypt,
  createCipheriv,
  createDecipheriv,
  randomBytes,
  constants,
} from 'crypto';
import { promisify } from 'util';

const generateKeyPairAsync = promisify(generateKeyPair);

@Injectable()
export class HybridEncryptionService {
  private generateKeyPairSync(): { publicKey: string; privateKey: string } {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    return { publicKey, privateKey };
  }

  async generateFreshKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    const { publicKey, privateKey } = await generateKeyPairAsync('rsa', {
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
    const aesKey = randomBytes(32);
    const iv = randomBytes(12);

    const cipher = createCipheriv(
      'aes-256-gcm',
      new Uint8Array(aesKey),
      new Uint8Array(iv),
    );
    const ciphertext =
      cipher.update(plaintext, 'utf8', 'hex') + cipher.final('hex');
    const authTag = cipher.getAuthTag();

    const encryptedKey = publicEncrypt(
      {
        key: publicKeyPem,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
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
    try {
      const aesKey = privateDecrypt(
        {
          key: privateKeyPem,
          padding: constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        Buffer.from(encryptedKey, 'hex'),
      );

      const decipher = createDecipheriv(
        'aes-256-gcm',
        new Uint8Array(aesKey),
        new Uint8Array(Buffer.from(iv, 'hex')),
      );
      decipher.setAuthTag(new Uint8Array(Buffer.from(authTag, 'hex')));

      const plaintext =
        decipher.update(ciphertext, 'hex', 'utf8') + decipher.final('utf8');

      return { plaintext, algorithm: 'RSA-OAEP + AES-256-GCM' };
    } catch {
      throw new BadRequestException('decryption failed');
    }
  }

  demonstrate() {
    const original =
      'Hybrid encryption combines RSA key exchange with AES bulk encryption';
    const { publicKey, privateKey } = this.generateKeyPairSync();

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
