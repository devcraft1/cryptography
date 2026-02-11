import { Injectable } from '@nestjs/common';
import {
  createHmac,
  generateKeyPairSync,
  createSign,
  createVerify,
} from 'crypto';

@Injectable()
export class JwtService {
  private base64UrlEncode(data: string): string {
    return Buffer.from(data).toString('base64url');
  }

  private base64UrlDecode(str: string): string {
    return Buffer.from(str, 'base64url').toString('utf-8');
  }

  signHs256(payload: object, secret: string) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));
    const data = `${encodedHeader}.${encodedPayload}`;

    const signature = createHmac('sha256', secret)
      .update(data)
      .digest('base64url');

    return { token: `${data}.${signature}` };
  }

  signRs256(payload: object) {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    const header = { alg: 'RS256', typ: 'JWT' };
    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));
    const data = `${encodedHeader}.${encodedPayload}`;

    const signer = createSign('SHA256');
    signer.update(data);
    const signature = signer.sign(privateKey, 'base64url');

    return { token: `${data}.${signature}`, publicKey };
  }

  verify(token: string, secretOrPublicKey: string, algorithm: string = 'HS256') {
    const parts = token.split('.');
    if (parts.length !== 3)
      return { isValid: false, error: 'Invalid token format' };

    const [encodedHeader, encodedPayload, signature] = parts;
    const data = `${encodedHeader}.${encodedPayload}`;

    let isValid = false;

    if (algorithm === 'HS256') {
      const expectedSignature = createHmac('sha256', secretOrPublicKey)
        .update(data)
        .digest('base64url');
      isValid = signature === expectedSignature;
    } else if (algorithm === 'RS256') {
      const verifier = createVerify('SHA256');
      verifier.update(data);
      isValid = verifier.verify(secretOrPublicKey, signature, 'base64url');
    }

    const payload = JSON.parse(this.base64UrlDecode(encodedPayload));
    return { isValid, payload };
  }

  decode(token: string) {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token format');

    return {
      header: JSON.parse(this.base64UrlDecode(parts[0])),
      payload: JSON.parse(this.base64UrlDecode(parts[1])),
      signature: parts[2],
      warning:
        'Decoding does NOT verify the token - always verify before trusting',
    };
  }

  demonstrate() {
    const payload = {
      sub: '1234567890',
      name: 'Alice',
      role: 'admin',
      iat: Math.floor(Date.now() / 1000),
    };

    const secret = 'my-super-secret-key';
    const hs256 = this.signHs256(payload, secret);
    const hs256Verified = this.verify(hs256.token, secret, 'HS256');
    const hs256Decoded = this.decode(hs256.token);

    const rs256 = this.signRs256(payload);
    const rs256Verified = this.verify(rs256.token, rs256.publicKey, 'RS256');

    const tampered = hs256.token.slice(0, -1) + 'X';
    const tamperedVerified = this.verify(tampered, secret, 'HS256');

    return {
      message:
        'JSON Web Tokens (JWT): Compact, URL-safe tokens for claims transfer',
      hs256: {
        algorithm: 'HMAC-SHA256 (symmetric)',
        token: hs256.token,
        decoded: hs256Decoded,
        isValid: hs256Verified.isValid,
      },
      rs256: {
        algorithm: 'RSA-SHA256 (asymmetric)',
        token: rs256.token.substring(0, 80) + '...',
        isValid: rs256Verified.isValid,
      },
      tamperedToken: { isValid: tamperedVerified.isValid },
      structure: 'header.payload.signature (each part is Base64URL encoded)',
    };
  }
}
