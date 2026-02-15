import { Injectable } from '@nestjs/common';
import { generateKeyPairSync } from 'crypto';
import { createSign, createVerify } from 'crypto';
@Injectable()
export class KeypairService {
  private cachedKeys: { pubkey: string; privkey: string } | null = null;

  signin() {
    const message = 'this data must be signed';
    /// SIGN
    const signer = createSign('rsa-sha256');
    signer.update(message);
    const signature = signer.sign(this.privateKey(), 'hex');

    /// VERIFY
    const verifier = createVerify('rsa-sha256');
    verifier.update(message);
    const isVerified = verifier.verify(this.publicKey(), signature, 'hex');
    return isVerified;
  }

  keyPairs() {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048, // the length of your key in bits
      publicKeyEncoding: {
        type: 'spki', // recommended to be 'spki' by the Node.js docs
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8', // recommended to be 'pkcs8' by the Node.js docs
        format: 'pem',
        // cipher: 'aes-256-cbc',
        // passphrase: 'top secret'
      },
    });
    return { pubkey: publicKey, privkey: privateKey };
  }

  publicKey() {
    if (!this.cachedKeys) this.cachedKeys = this.keyPairs();
    return this.cachedKeys.pubkey;
  }

  privateKey() {
    if (!this.cachedKeys) this.cachedKeys = this.keyPairs();
    return this.cachedKeys.privkey;
  }
}
