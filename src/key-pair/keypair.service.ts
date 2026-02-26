import { Injectable, OnModuleInit } from '@nestjs/common';
import { generateKeyPair, generateKeyPairSync } from 'crypto';
import { createSign, createVerify } from 'crypto';
import { promisify } from 'util';

const generateKeyPairAsync = promisify(generateKeyPair);

@Injectable()
export class KeypairService implements OnModuleInit {
  private cachedKeys: { pubkey: string; privkey: string } | null = null;

  onModuleInit() {
    this.cachedKeys = this.generateKeyPairSync();
  }

  signin() {
    const message = 'this data must be signed';
    const signer = createSign('rsa-sha256');
    signer.update(message);
    const signature = signer.sign(this.privateKey(), 'hex');

    const verifier = createVerify('rsa-sha256');
    verifier.update(message);
    const isVerified = verifier.verify(this.publicKey(), signature, 'hex');
    return isVerified;
  }

  private generateKeyPairSync() {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    return { pubkey: publicKey, privkey: privateKey };
  }

  keyPairs() {
    if (!this.cachedKeys) this.cachedKeys = this.generateKeyPairSync();
    return this.cachedKeys;
  }

  async generateFreshKeyPair() {
    const { privateKey, publicKey } = await generateKeyPairAsync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    return { pubkey: publicKey, privkey: privateKey };
  }

  publicKey() {
    if (!this.cachedKeys) this.cachedKeys = this.generateKeyPairSync();
    return this.cachedKeys.pubkey;
  }

  privateKey() {
    if (!this.cachedKeys) this.cachedKeys = this.generateKeyPairSync();
    return this.cachedKeys.privkey;
  }
}
