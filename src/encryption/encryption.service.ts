import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { privateDecrypt, publicEncrypt } from 'crypto';
import { KeypairService } from '../key-pair/keypair.service';
import { AesGcmService } from '../aes-gcm/aes-gcm.service';

@Injectable()
export class EncryptionService {
  private readonly logger = new Logger(EncryptionService.name);

  constructor(
    private keypair: KeypairService,
    private aesGcm: AesGcmService,
  ) {}

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
    } catch (error) {
      this.logger.error(`Asymmetric decryption failed: ${error.message}`);
      throw new BadRequestException('asymmetric decryption failed: invalid key or corrupted ciphertext');
    }
  }

  symmetric() {
    const message = 'i like turtles';

    const encrypted = this.aesGcm.encrypt(message);

    try {
      const decrypted = this.aesGcm.decrypt(
        encrypted.ciphertext,
        encrypted.key,
        encrypted.iv,
        encrypted.authTag,
      );
      return decrypted.plaintext;
    } catch (error) {
      this.logger.error(`Symmetric decryption failed: ${error.message}`);
      throw new BadRequestException('symmetric decryption failed');
    }
  }
} 