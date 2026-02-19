import { BadRequestException, Injectable } from '@nestjs/common';
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
  // asymmetric
  asymmetric() {
    const message = 'the british are coming!';

    const encryptedData = publicEncrypt(
      this.keypair.publicKey(),
      new Uint8Array(Buffer.from(message)),
    );

    try {
      const decryptedData = privateDecrypt(
        this.keypair.privateKey(),
        new Uint8Array(encryptedData),
      );

      return decryptedData.toString('utf-8');
    } catch {
      throw new BadRequestException('decryption failed');
    }
  }

  // symmetric
  symmetric() {
    const message = 'i like turtles';
    const key = randomBytes(32);
    const iv = randomBytes(12);

    const cipher = createCipheriv(
      'aes-256-gcm',
      new Uint8Array(key),
      new Uint8Array(iv),
    );

    const encryptedMessage =
      cipher.update(message, 'utf8', 'hex') + cipher.final('hex');
    const authTag = cipher.getAuthTag();

    try {
      const decipher = createDecipheriv(
        'aes-256-gcm',
        new Uint8Array(key),
        new Uint8Array(iv),
      );
      decipher.setAuthTag(authTag);
      const decryptedMessage =
        decipher.update(encryptedMessage, 'hex', 'utf-8') +
        decipher.final('utf8');

      return decryptedMessage;
    } catch {
      throw new BadRequestException('decryption failed');
    }
  }
}
  