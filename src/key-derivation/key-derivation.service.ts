import { Injectable } from '@nestjs/common';
import { pbkdf2Sync, scryptSync, randomBytes, timingSafeEqual } from 'crypto';

@Injectable()
export class KeyDerivationService {
  pbkdf2(
    password: string,
    salt: string = randomBytes(16).toString('hex'),
    iterations = 100000,
    keyLength = 64,
    digest = 'sha512',
  ) {
    const derivedKey = pbkdf2Sync(
      password,
      salt,
      iterations,
      keyLength,
      digest,
    );

    return {
      derivedKey: derivedKey.toString('hex'),
      salt,
      iterations,
      keyLength,
      digest,
    };
  }

  scrypt(
    password: string,
    salt: string = randomBytes(16).toString('hex'),
    keyLength = 64,
    options: { N?: number; r?: number; p?: number } = {},
  ) {
    const { N = 16384, r = 8, p = 1 } = options;
    const derivedKey = scryptSync(password, salt, keyLength);

    return {
      derivedKey: derivedKey.toString('hex'),
      salt,
      keyLength,
      options: { N, r, p },
    };
  }

  verifyPassword(
    password: string,
    storedSalt: string,
    storedKey: string,
    method: 'pbkdf2' | 'scrypt' = 'pbkdf2',
    options?: any,
  ): boolean {
    let derivedKey: Buffer;

    if (method === 'pbkdf2') {
      const {
        iterations = 100000,
        keyLength = 64,
        digest = 'sha512',
      } = options || {};
      derivedKey = pbkdf2Sync(
        password,
        storedSalt,
        iterations,
        keyLength,
        digest,
      );
    } else {
      const keyLength = options?.keyLength || 64;
      derivedKey = scryptSync(password, storedSalt, keyLength);
    }

    const storedKeyBuffer = Buffer.from(storedKey, 'hex');

    return timingSafeEqual(
      new Uint8Array(derivedKey),
      new Uint8Array(storedKeyBuffer),
    );
  }

  demonstrateKdf() {
    const password = 'mySecurePassword123!';

    const pbkdf2Result = this.pbkdf2(password);
    const scryptResult = this.scrypt(password);

    const isPbkdf2Valid = this.verifyPassword(
      password,
      pbkdf2Result.salt,
      pbkdf2Result.derivedKey,
      'pbkdf2',
      {
        iterations: pbkdf2Result.iterations,
        keyLength: pbkdf2Result.keyLength,
        digest: pbkdf2Result.digest,
      },
    );

    const isScryptValid = this.verifyPassword(
      password,
      scryptResult.salt,
      scryptResult.derivedKey,
      'scrypt',
      { keyLength: scryptResult.keyLength },
    );

    return {
      password,
      pbkdf2: {
        ...pbkdf2Result,
        isValid: isPbkdf2Valid,
      },
      scrypt: {
        ...scryptResult,
        isValid: isScryptValid,
      },
      demonstration:
        'Key derivation functions make brute force attacks computationally expensive',
    };
  }

  generateSalt(length = 16): string {
    return randomBytes(length).toString('hex');
  }
}
