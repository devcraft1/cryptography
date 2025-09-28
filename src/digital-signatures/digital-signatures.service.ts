import { Injectable } from '@nestjs/common';
import {
  generateKeyPairSync,
  createSign,
  createVerify,
  randomBytes,
} from 'crypto';

@Injectable()
export class DigitalSignaturesService {
  private keyPair = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  generateKeyPair() {
    const keyPair = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    return {
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey,
    };
  }

  signMessage(message: string, privateKey?: string): string {
    const key = privateKey || this.keyPair.privateKey;
    const sign = createSign('SHA256');
    sign.update(message);
    sign.end();

    return sign.sign(key, 'hex');
  }

  verifySignature(
    message: string,
    signature: string,
    publicKey?: string,
  ): boolean {
    const key = publicKey || this.keyPair.publicKey;
    const verify = createVerify('SHA256');
    verify.update(message);
    verify.end();

    return verify.verify(key, signature, 'hex');
  }

  demonstrateDigitalSignature() {
    const message = 'This message is digitally signed for authenticity';
    const signature = this.signMessage(message);
    const isValid = this.verifySignature(message, signature);

    const tamperedMessage = 'This message has been tampered with';
    const isTamperedValid = this.verifySignature(tamperedMessage, signature);

    return {
      message,
      signature,
      isValid,
      tamperedMessage,
      isTamperedValid,
      publicKey: this.keyPair.publicKey,
      demonstration:
        'Digital signatures provide authentication, integrity, and non-repudiation',
    };
  }

  generateNonce(length = 16): string {
    return randomBytes(length).toString('hex');
  }
}
