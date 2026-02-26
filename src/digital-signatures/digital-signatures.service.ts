import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  generateKeyPairSync,
  generateKeyPair,
  createSign,
  createVerify,
  randomBytes,
} from 'crypto';
import { promisify } from 'util';

const generateKeyPairAsync = promisify(generateKeyPair);

@Injectable()
export class DigitalSignaturesService implements OnModuleInit {
  private cachedKeys: { publicKey: string; privateKey: string } | null = null;

  onModuleInit() {
    this.cachedKeys = this.generateKeyPairSync();
  }

  private generateKeyPairSync() {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    return { publicKey, privateKey };
  }

  async generateFreshKeyPair() {
    const { publicKey, privateKey } = await generateKeyPairAsync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    return { publicKey, privateKey };
  }

  signMessage(message: string, privateKey?: string): string {
    if (!this.cachedKeys) this.cachedKeys = this.generateKeyPairSync();
    const key = privateKey || this.cachedKeys.privateKey;
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
    if (!this.cachedKeys) this.cachedKeys = this.generateKeyPairSync();
    const key = publicKey || this.cachedKeys.publicKey;
    const verify = createVerify('SHA256');
    verify.update(message);
    verify.end();

    return verify.verify(key, signature, 'hex');
  }

  demonstrateDigitalSignature() {
    if (!this.cachedKeys) this.cachedKeys = this.generateKeyPairSync();
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
      publicKey: this.cachedKeys.publicKey,
      demonstration:
        'Digital signatures provide authentication, integrity, and non-repudiation',
    };
  }

  generateNonce(length = 16): string {
    return randomBytes(length).toString('hex');
  }
}
