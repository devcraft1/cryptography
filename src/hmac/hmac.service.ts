import { Injectable } from '@nestjs/common';
import { createHmac, timingSafeEqual, randomBytes } from 'crypto';

@Injectable()
export class HmacService {
  generateHmac(message: string, key: string, algorithm = 'sha256'): string {
    return createHmac(algorithm, key).update(message).digest('hex');
  }

  verifyHmac(
    message: string,
    key: string,
    expectedHmac: string,
    algorithm = 'sha256',
  ): boolean {
    const computedHmac = this.generateHmac(message, key, algorithm);

    const expectedBuffer = Buffer.from(expectedHmac, 'hex');
    const computedBuffer = Buffer.from(computedHmac, 'hex');

    if (expectedBuffer.length !== computedBuffer.length) {
      return false;
    }

    return timingSafeEqual(
      new Uint8Array(expectedBuffer),
      new Uint8Array(computedBuffer),
    );
  }

  generateSecretKey(length = 32): string {
    return randomBytes(length).toString('hex');
  }

  demonstrateHmac() {
    const key = this.generateSecretKey();
    const message = 'Secure message for HMAC demonstration';

    const hmac = this.generateHmac(message, key);
    const isValid = this.verifyHmac(message, key, hmac);

    return {
      message,
      key,
      hmac,
      isValid,
      demonstration: 'HMAC ensures message integrity and authenticity',
    };
  }
}
