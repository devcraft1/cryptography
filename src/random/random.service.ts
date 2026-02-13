import { Injectable } from '@nestjs/common';
import { randomBytes, randomUUID, randomInt } from 'crypto';

@Injectable()
export class RandomService {
  generateBytes(size = 32) {
    const bytes = randomBytes(size);
    return {
      hex: bytes.toString('hex'),
      base64: bytes.toString('base64'),
      size,
      source: 'crypto.randomBytes (CSPRNG)',
    };
  }

  generateUuid() {
    return {
      uuid: randomUUID(),
      version: 4,
      source: 'crypto.randomUUID',
    };
  }

  generateInt(min = 0, max = 100) {
    const value = randomInt(min, max);
    return {
      value,
      min,
      max,
      source: 'crypto.randomInt (CSPRNG)',
    };
  }

  demonstrate() {
    return {
      message:
        'Cryptographically Secure Pseudo-Random Number Generation (CSPRNG)',
      bytes: this.generateBytes(16),
      uuid: this.generateUuid(),
      integer: this.generateInt(1, 1000000),
      warning: 'Never use Math.random() for security-sensitive operations',
    };
  }
}
