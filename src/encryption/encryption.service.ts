import { Injectable } from '@nestjs/common';
import {
  privateDecrypt,
  publicEncrypt,
  createCipheriv,
  randomBytes,
  createDecipheriv,
} from 'crypto';
import { KeypairService } from '../key-pair/keypair.service';

@Injectable()
export class EncryptionService {
  constructor(private keypair: KeypairService) {}
  // asymetric
  asymmetric() {
    const message = 'the british are coming!';

    const encryptedData = publicEncrypt(
      this.keypair.publicKey(),
      new Uint8Array(Buffer.from(message)),
    );

    console.log(encryptedData.toString('hex'));

    const decryptedData = privateDecrypt(
      this.keypair.privateKey(),
      new Uint8Array(encryptedData),
    );

    console.log(decryptedData.toString('utf-8'));
  }

  // symetric
  symmetric() {
    /// Cipher
    const message = 'i like turtles';
    const key = randomBytes(32);
    const iv = randomBytes(16);

    const cipher = createCipheriv(
      'aes256',
      new Uint8Array(key),
      new Uint8Array(iv),
    );

    /// Encrypt
    const encryptedMessage =
      cipher.update(message, 'utf8', 'hex') + cipher.final('hex');
    console.log(`Encrypted: ${encryptedMessage}`);

    /// Decrypt

    const decipher = createDecipheriv(
      'aes256',
      new Uint8Array(key),
      new Uint8Array(iv),
    );
    const decryptedMessage =
      decipher.update(encryptedMessage, 'hex', 'utf-8') +
      decipher.final('utf8');

    return decryptedMessage;

    // console.log(`Deciphered: ${decryptedMessage.toString('utf-8')}`);
  }
}
