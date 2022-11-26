import { Injectable } from '@nestjs/common';
import { generateKeyPairSync } from 'crypto';

@Injectable()
export class KeypairService {
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
    console.log(publicKey);
    console.log(privateKey);
    return { privkey: publicKey, pubkey: privateKey };
  }
}
