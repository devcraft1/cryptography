import { BadRequestException, Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

interface Envelope {
  encryptedData: string;
  dataIv: string;
  dataAuthTag: string;
  encryptedDek: string;
  dekIv: string;
  dekAuthTag: string;
}

@Injectable()
export class EnvelopeEncryptionService {
  generateMasterKey() {
    const masterKey = randomBytes(32).toString('hex');
    return { masterKey };
  }

  encrypt(plaintext: string, masterKeyHex?: string) {
    const masterKey = masterKeyHex
      ? Buffer.from(masterKeyHex, 'hex')
      : randomBytes(32);

    // Step 1: Generate a random Data Encryption Key (DEK)
    const dek = randomBytes(32);

    // Step 2: Encrypt plaintext with DEK using AES-256-GCM
    const dataIv = randomBytes(12);
    const dataCipher = createCipheriv(
      'aes-256-gcm',
      new Uint8Array(dek),
      new Uint8Array(dataIv),
    );
    const encryptedData =
      dataCipher.update(plaintext, 'utf8', 'hex') + dataCipher.final('hex');
    const dataAuthTag = dataCipher.getAuthTag();

    // Step 3: Encrypt DEK with master key using AES-256-GCM
    const dekIv = randomBytes(12);
    const dekCipher = createCipheriv(
      'aes-256-gcm',
      new Uint8Array(masterKey),
      new Uint8Array(dekIv),
    );
    const encryptedDek =
      dekCipher.update(dek.toString('hex'), 'utf8', 'hex') +
      dekCipher.final('hex');
    const dekAuthTag = dekCipher.getAuthTag();

    return {
      masterKey: masterKey.toString('hex'),
      envelope: {
        encryptedData,
        dataIv: dataIv.toString('hex'),
        dataAuthTag: dataAuthTag.toString('hex'),
        encryptedDek,
        dekIv: dekIv.toString('hex'),
        dekAuthTag: dekAuthTag.toString('hex'),
      },
    };
  }

  decrypt(envelope: Envelope, masterKeyHex: string) {
    try {
      const masterKey = Buffer.from(masterKeyHex, 'hex');

      // Step 1: Decrypt DEK using master key
      const dekDecipher = createDecipheriv(
        'aes-256-gcm',
        new Uint8Array(masterKey),
        new Uint8Array(Buffer.from(envelope.dekIv, 'hex')),
      );
      dekDecipher.setAuthTag(
        new Uint8Array(Buffer.from(envelope.dekAuthTag, 'hex')),
      );
      const dekHex =
        dekDecipher.update(envelope.encryptedDek, 'hex', 'utf8') +
        dekDecipher.final('utf8');
      const dek = Buffer.from(dekHex, 'hex');

      // Step 2: Decrypt data using DEK
      const dataDecipher = createDecipheriv(
        'aes-256-gcm',
        new Uint8Array(dek),
        new Uint8Array(Buffer.from(envelope.dataIv, 'hex')),
      );
      dataDecipher.setAuthTag(
        new Uint8Array(Buffer.from(envelope.dataAuthTag, 'hex')),
      );
      const plaintext =
        dataDecipher.update(envelope.encryptedData, 'hex', 'utf8') +
        dataDecipher.final('utf8');

      return { plaintext, algorithm: 'Envelope: AES-256-GCM' };
    } catch {
      throw new BadRequestException('decryption failed');
    }
  }

  rotateMasterKey(
    envelope: Envelope,
    oldMasterKeyHex: string,
    newMasterKeyHex?: string,
  ) {
    const oldMasterKey = Buffer.from(oldMasterKeyHex, 'hex');
    const newMasterKey = newMasterKeyHex
      ? Buffer.from(newMasterKeyHex, 'hex')
      : randomBytes(32);

    let dekHex: string;
    try {
      // Step 1: Decrypt DEK with old master key
      const dekDecipher = createDecipheriv(
        'aes-256-gcm',
        new Uint8Array(oldMasterKey),
        new Uint8Array(Buffer.from(envelope.dekIv, 'hex')),
      );
      dekDecipher.setAuthTag(
        new Uint8Array(Buffer.from(envelope.dekAuthTag, 'hex')),
      );
      dekHex =
        dekDecipher.update(envelope.encryptedDek, 'hex', 'utf8') +
        dekDecipher.final('utf8');
    } catch {
      throw new BadRequestException('decryption failed');
    }

    // Step 2: Re-encrypt DEK with new master key
    const newDekIv = randomBytes(12);
    const dekCipher = createCipheriv(
      'aes-256-gcm',
      new Uint8Array(newMasterKey),
      new Uint8Array(newDekIv),
    );
    const newEncryptedDek =
      dekCipher.update(dekHex, 'utf8', 'hex') + dekCipher.final('hex');
    const newDekAuthTag = dekCipher.getAuthTag();

    return {
      masterKey: newMasterKey.toString('hex'),
      envelope: {
        encryptedData: envelope.encryptedData,
        dataIv: envelope.dataIv,
        dataAuthTag: envelope.dataAuthTag,
        encryptedDek: newEncryptedDek,
        dekIv: newDekIv.toString('hex'),
        dekAuthTag: newDekAuthTag.toString('hex'),
      },
    };
  }

  demonstrate() {
    const message =
      'Envelope encryption protects data with a two-layer key hierarchy';

    // Step 1: Generate master key
    const { masterKey } = this.generateMasterKey();

    // Step 2: Encrypt message
    const encrypted = this.encrypt(message, masterKey);

    // Step 3: Decrypt and verify
    const decrypted = this.decrypt(encrypted.envelope, masterKey);
    const roundTripSuccess = decrypted.plaintext === message;

    // Step 4: Demonstrate key rotation
    const rotated = this.rotateMasterKey(encrypted.envelope, masterKey);
    const decryptedAfterRotation = this.decrypt(
      rotated.envelope,
      rotated.masterKey,
    );
    const rotationSuccess = decryptedAfterRotation.plaintext === message;

    // Verify old key no longer works on rotated envelope
    let oldKeyFails = false;
    try {
      this.decrypt(rotated.envelope, masterKey);
    } catch {
      oldKeyFails = true;
    }

    return {
      message:
        'Envelope Encryption: Two-layer key hierarchy used by AWS KMS, GCP KMS, etc.',
      original: message,
      masterKey,
      envelope: encrypted.envelope,
      decrypted: decrypted.plaintext,
      roundTripSuccess,
      keyRotation: {
        newMasterKey: rotated.masterKey,
        newEnvelope: rotated.envelope,
        decryptedAfterRotation: decryptedAfterRotation.plaintext,
        rotationSuccess,
        oldKeyFails,
        note: 'Key rotation re-encrypts only the DEK, not the data — efficient for large datasets',
      },
      advantage:
        'Data key is stored encrypted; master key never touches raw data directly',
    };
  }
}
