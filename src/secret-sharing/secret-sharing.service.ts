import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';

@Injectable()
export class SecretSharingService {
  private readonly EXP = new Uint8Array(512);
  private readonly LOG = new Uint8Array(256);

  constructor() {
    let x = 1;
    for (let i = 0; i < 255; i++) {
      this.EXP[i] = x;
      this.LOG[x] = i;
      x = x ^ ((x << 1) ^ (x & 0x80 ? 0x11b : 0));
      x &= 0xff;
    }
    for (let i = 255; i < 512; i++) {
      this.EXP[i] = this.EXP[i - 255];
    }
  }

  private gfMul(a: number, b: number): number {
    if (a === 0 || b === 0) return 0;
    return this.EXP[this.LOG[a] + this.LOG[b]];
  }

  private gfDiv(a: number, b: number): number {
    if (b === 0) throw new Error('Division by zero');
    if (a === 0) return 0;
    return this.EXP[(this.LOG[a] + 255 - this.LOG[b]) % 255];
  }

  split(secret: string, totalShares: number = 5, threshold: number = 3) {
    if (threshold > totalShares)
      throw new Error('Threshold cannot exceed total shares');
    if (threshold < 2) throw new Error('Threshold must be at least 2');
    if (totalShares > 255) throw new Error('Maximum 255 shares');

    const secretBytes = Buffer.from(secret, 'utf-8');
    const shares: Buffer[] = Array.from({ length: totalShares }, () =>
      Buffer.alloc(secretBytes.length),
    );

    for (let byteIndex = 0; byteIndex < secretBytes.length; byteIndex++) {
      const coefficients = new Uint8Array(threshold);
      coefficients[0] = secretBytes[byteIndex];
      const randBytes = randomBytes(threshold - 1);
      for (let i = 1; i < threshold; i++) {
        coefficients[i] = randBytes[i - 1];
      }

      for (let shareIndex = 0; shareIndex < totalShares; shareIndex++) {
        const x = shareIndex + 1;
        let y = 0;
        for (let k = threshold - 1; k >= 0; k--) {
          y = this.gfMul(y, x) ^ coefficients[k];
        }
        shares[shareIndex][byteIndex] = y;
      }
    }

    return {
      shares: shares.map((s, i) => ({ index: i + 1, data: s.toString('hex') })),
      threshold,
      totalShares,
    };
  }

  combine(shares: { index: number; data: string }[]) {
    if (shares.length < 2) throw new Error('Need at least 2 shares');

    const shareBuffers = shares.map((s) => ({
      x: s.index,
      y: Buffer.from(s.data, 'hex'),
    }));

    const secretLength = shareBuffers[0].y.length;
    const result = Buffer.alloc(secretLength);

    for (let byteIndex = 0; byteIndex < secretLength; byteIndex++) {
      let secret = 0;
      for (let i = 0; i < shareBuffers.length; i++) {
        let numerator = 1;
        let denominator = 1;
        for (let j = 0; j < shareBuffers.length; j++) {
          if (i === j) continue;
          numerator = this.gfMul(numerator, shareBuffers[j].x);
          denominator = this.gfMul(
            denominator,
            shareBuffers[i].x ^ shareBuffers[j].x,
          );
        }
        const lagrange = this.gfDiv(numerator, denominator);
        secret ^= this.gfMul(shareBuffers[i].y[byteIndex], lagrange);
      }
      result[byteIndex] = secret;
    }

    return { secret: result.toString('utf-8') };
  }

  demonstrate() {
    const secret = 'Nuclear launch code: 42';
    const { shares, threshold, totalShares } = this.split(secret, 5, 3);

    const reconstructed = this.combine(shares.slice(0, 3));
    const reconstructed2 = this.combine([shares[0], shares[2], shares[4]]);

    return {
      message:
        "Shamir's Secret Sharing: Split a secret into N shares, require K to reconstruct",
      secret,
      totalShares,
      threshold,
      shares: shares.map((s) => ({
        index: s.index,
        data: s.data.substring(0, 20) + '...',
      })),
      reconstruction1: {
        sharesUsed: [1, 2, 3],
        recovered: reconstructed.secret,
        success: reconstructed.secret === secret,
      },
      reconstruction2: {
        sharesUsed: [1, 3, 5],
        recovered: reconstructed2.secret,
        success: reconstructed2.secret === secret,
      },
      keyPoint: `Any ${threshold} of ${totalShares} shares can recover the secret, but ${threshold - 1} shares reveal nothing`,
    };
  }
}
