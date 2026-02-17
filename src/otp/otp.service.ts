import { Injectable } from '@nestjs/common';
import { randomBytes, createHmac, timingSafeEqual } from 'crypto';

@Injectable()
export class OtpService {
  generateSecret(length = 20) {
    const buffer = randomBytes(length);
    return {
      secret: buffer.toString('hex'),
      base32: this.toBase32(buffer),
    };
  }

  generateHotp(secretHex: string, counter: number) {
    const hmac = createHmac('sha1', Buffer.from(secretHex, 'hex'));

    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeBigUInt64BE(BigInt(counter));
    hmac.update(new Uint8Array(counterBuffer));
    const hash = hmac.digest();

    const offset = hash[hash.length - 1] & 0x0f;
    const code =
      (((hash[offset] & 0x7f) << 24) |
        ((hash[offset + 1] & 0xff) << 16) |
        ((hash[offset + 2] & 0xff) << 8) |
        (hash[offset + 3] & 0xff)) %
      1000000;

    return { otp: code.toString().padStart(6, '0'), counter };
  }

  verifyHotp(otp: string, secretHex: string, counter: number) {
    const expected = this.generateHotp(secretHex, counter);
    const a = Buffer.from(expected.otp);
    const b = Buffer.from(otp);
    const isValid = a.length === b.length && timingSafeEqual(a, b);
    return { isValid };
  }

  generateTotp(secretHex: string, timeStep = 30) {
    const now = Math.floor(Date.now() / 1000);
    const counter = Math.floor(now / timeStep);
    const remaining = timeStep - (now % timeStep);
    const { otp } = this.generateHotp(secretHex, counter);
    return { otp, timeStep, remainingSeconds: remaining };
  }

  verifyTotp(otp: string, secretHex: string, timeStep = 30, window = 1) {
    const now = Math.floor(Date.now() / 1000);
    const counter = Math.floor(now / timeStep);

    for (let i = -window; i <= window; i++) {
      const { otp: expected } = this.generateHotp(secretHex, counter + i);
      if (expected === otp) return { isValid: true };
    }
    return { isValid: false };
  }

  demonstrate() {
    const { secret, base32 } = this.generateSecret();
    const hotp = this.generateHotp(secret, 0);
    const hotpVerified = this.verifyHotp(hotp.otp, secret, 0);
    const totp = this.generateTotp(secret);
    const totpVerified = this.verifyTotp(totp.otp, secret);

    return {
      message: 'One-Time Passwords (OTP) for Two-Factor Authentication',
      secret: { hex: secret, base32 },
      hotp: {
        description: 'HMAC-based OTP (RFC 4226) - counter-based',
        otp: hotp.otp,
        counter: hotp.counter,
        isValid: hotpVerified.isValid,
      },
      totp: {
        description: 'Time-based OTP (RFC 6238) - time-based',
        otp: totp.otp,
        timeStep: totp.timeStep,
        remainingSeconds: totp.remainingSeconds,
        isValid: totpVerified.isValid,
      },
    };
  }

  private toBase32(buffer: Buffer): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    for (const byte of buffer) {
      bits += byte.toString(2).padStart(8, '0');
    }
    let result = '';
    for (let i = 0; i < bits.length; i += 5) {
      const chunk = bits.substring(i, i + 5).padEnd(5, '0');
      result += alphabet[parseInt(chunk, 2)];
    }
    return result;
  }
}
