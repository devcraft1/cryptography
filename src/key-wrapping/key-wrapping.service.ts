import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

@Injectable()
export class KeyWrappingService {
  generateKek() {
    const kek = randomBytes(32).toString('hex');
    return { kek };
  }

  generateDataKey(bytes = 32) {
    const dataKey = randomBytes(bytes).toString('hex');
    return { dataKey, bytes };
  }

  wrap(keyToWrap: string, kek?: string) {
    const kekBuf = kek ? Buffer.from(kek, 'hex') : randomBytes(32);
    const iv = randomBytes(12);

    const cipher = createCipheriv(
      'aes-256-gcm',
      new Uint8Array(kekBuf),
      new Uint8Array(iv),
    );

    const wrappedKey =
      cipher.update(keyToWrap, 'hex', 'hex') + cipher.final('hex');
    const authTag = cipher.getAuthTag();

    return {
      wrappedKey,
      kek: kekBuf.toString('hex'),
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      algorithm: 'AES-256-GCM-WRAP',
    };
  }

  unwrap(
    wrappedKey: string,
    kek: string,
    iv: string,
    authTag: string,
  ) {
    const kekBuf = Buffer.from(kek, 'hex');
    const ivBuf = Buffer.from(iv, 'hex');
    const authTagBuf = Buffer.from(authTag, 'hex');

    const decipher = createDecipheriv(
      'aes-256-gcm',
      new Uint8Array(kekBuf),
      new Uint8Array(ivBuf),
    );
    decipher.setAuthTag(new Uint8Array(authTagBuf));

    const unwrappedKey =
      decipher.update(wrappedKey, 'hex', 'hex') + decipher.final('hex');

    return {
      unwrappedKey,
      algorithm: 'AES-256-GCM-WRAP',
    };
  }

  demonstrate() {
    const { kek } = this.generateKek();
    const { dataKey } = this.generateDataKey();

    const wrapped = this.wrap(dataKey, kek);
    const { unwrappedKey } = this.unwrap(
      wrapped.wrappedKey,
      kek,
      wrapped.iv,
      wrapped.authTag,
    );

    const keysMatch = unwrappedKey === dataKey;

    let wrongKekFails = false;
    try {
      const wrongKek = randomBytes(32).toString('hex');
      this.unwrap(wrapped.wrappedKey, wrongKek, wrapped.iv, wrapped.authTag);
    } catch {
      wrongKekFails = true;
    }

    return {
      kek,
      dataKey,
      wrappedKey: wrapped.wrappedKey,
      unwrappedKey,
      keysMatch,
      wrongKekFails,
      algorithm: 'AES-256-GCM-WRAP',
      description:
        'AES Key Wrapping protects cryptographic keys using a Key Encryption Key (KEK). ' +
        'The data encryption key (DEK) is encrypted with the KEK so it can be safely stored or transmitted.',
    };
  }
}
