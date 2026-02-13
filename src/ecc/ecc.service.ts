import { Injectable } from '@nestjs/common';
import { generateKeyPairSync, createSign, createVerify } from 'crypto';

@Injectable()
export class EccService {
  generateKeyPair(namedCurve = 'P-256') {
    const { publicKey, privateKey } = generateKeyPairSync('ec', {
      namedCurve,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    return { publicKey, privateKey, curve: namedCurve };
  }

  sign(message: string, privateKeyPem?: string) {
    let privateKey = privateKeyPem;
    let publicKey: string | undefined;

    if (!privateKey) {
      const keyPair = this.generateKeyPair('P-256');
      privateKey = keyPair.privateKey;
      publicKey = keyPair.publicKey;
    }

    const signer = createSign('SHA256');
    signer.update(message);
    const signature = signer.sign(privateKey, 'hex');

    const result: any = { signature, message };
    if (publicKey) result.publicKey = publicKey;
    return result;
  }

  verify(message: string, signature: string, publicKey: string) {
    const verifier = createVerify('SHA256');
    verifier.update(message);
    const isValid = verifier.verify(publicKey, signature, 'hex');
    return { isValid, message };
  }

  demonstrate() {
    const message =
      'Elliptic Curve Cryptography provides strong security with smaller keys';
    const keyPair = this.generateKeyPair('P-256');
    const signed = this.sign(message, keyPair.privateKey);
    const verified = this.verify(message, signed.signature, keyPair.publicKey);
    const tampered = this.verify(
      message + '!',
      signed.signature,
      keyPair.publicKey,
    );

    return {
      message: 'ECDSA: Elliptic Curve Digital Signature Algorithm',
      curve: 'P-256 (secp256r1)',
      original: message,
      signature: signed.signature,
      isValid: verified.isValid,
      isTamperedValid: tampered.isValid,
      publicKey: keyPair.publicKey,
      advantage:
        'A 256-bit EC key provides equivalent security to a 3072-bit RSA key',
    };
  }
}
