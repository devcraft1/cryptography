import { Injectable } from '@nestjs/common';
import { generateKeyPairSync } from 'crypto';
import { createSign, createVerify } from 'crypto';
@Injectable()
export class KeypairService {
  signInKeypair() {
    const message = 'this data must be signed';
    /// SIGN
    const signer = createSign('rsa-sha256');
    signer.update(message);
    const signature = signer.sign(this.privateKey(), 'hex');

    /// VERIFY
    const verifier = createVerify('rsa-sha256');
    verifier.update(message);
    const isVerified = verifier.verify(this.publicKey(), signature, 'hex');
    console.log(`Verified: ${isVerified}`);
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
    // console.log(publicKey);
    // console.log(privateKey);
    return { pubkey: publicKey, privkey: privateKey };
  }

  allKeys() {
    return this.keyPairs();
  }

  publicKey() {
    return this.keyPairs().pubkey;
  }

  privateKey() {
    return this.keyPairs().privkey;
  }
}
