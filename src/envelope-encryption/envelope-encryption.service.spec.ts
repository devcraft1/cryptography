import { Test, TestingModule } from '@nestjs/testing';
import { EnvelopeEncryptionService } from './envelope-encryption.service';

describe('EnvelopeEncryptionService', () => {
  let service: EnvelopeEncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnvelopeEncryptionService],
    }).compile();
    service = module.get<EnvelopeEncryptionService>(EnvelopeEncryptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateMasterKey', () => {
    it('should return a 64-char hex string', () => {
      const result = service.generateMasterKey();
      expect(result.masterKey).toBeDefined();
      expect(result.masterKey).toHaveLength(64);
      expect(result.masterKey).toMatch(/^[0-9a-f]{64}$/);
    });
  });

  describe('encrypt', () => {
    it('should return masterKey and envelope with all fields', () => {
      const result = service.encrypt('hello envelope');
      expect(result.masterKey).toBeDefined();
      expect(result.masterKey).toHaveLength(64);
      expect(result.envelope).toBeDefined();
      expect(result.envelope.encryptedData).toBeDefined();
      expect(result.envelope.dataIv).toBeDefined();
      expect(result.envelope.dataAuthTag).toBeDefined();
      expect(result.envelope.encryptedDek).toBeDefined();
      expect(result.envelope.dekIv).toBeDefined();
      expect(result.envelope.dekAuthTag).toBeDefined();
    });

    it('should accept a provided master key', () => {
      const masterKey = 'ab'.repeat(32);
      const result = service.encrypt('test', masterKey);
      expect(result.masterKey).toBe(masterKey);
    });
  });

  describe('encrypt + decrypt round-trip', () => {
    it('should decrypt back to original plaintext', () => {
      const plaintext = 'envelope encryption round-trip test';
      const encrypted = service.encrypt(plaintext);
      const decrypted = service.decrypt(
        encrypted.envelope,
        encrypted.masterKey,
      );
      expect(decrypted.plaintext).toBe(plaintext);
      expect(decrypted.algorithm).toBe('Envelope: AES-256-GCM');
    });
  });

  describe('decrypt with wrong master key', () => {
    it('should throw an error', () => {
      const encrypted = service.encrypt('secret data');
      const wrongKey = 'ff'.repeat(32);
      expect(() =>
        service.decrypt(encrypted.envelope, wrongKey),
      ).toThrow();
    });
  });

  describe('rotateMasterKey', () => {
    it('should produce a new envelope that decrypts with the new key', () => {
      const plaintext = 'data surviving key rotation';
      const encrypted = service.encrypt(plaintext);
      const rotated = service.rotateMasterKey(
        encrypted.envelope,
        encrypted.masterKey,
      );

      expect(rotated.masterKey).toBeDefined();
      expect(rotated.masterKey).not.toBe(encrypted.masterKey);
      expect(rotated.envelope.encryptedData).toBe(
        encrypted.envelope.encryptedData,
      );

      const decrypted = service.decrypt(rotated.envelope, rotated.masterKey);
      expect(decrypted.plaintext).toBe(plaintext);
    });

    it('should no longer decrypt with the old master key', () => {
      const encrypted = service.encrypt('rotation test');
      const rotated = service.rotateMasterKey(
        encrypted.envelope,
        encrypted.masterKey,
      );

      expect(() =>
        service.decrypt(rotated.envelope, encrypted.masterKey),
      ).toThrow();
    });
  });

  describe('demonstrate', () => {
    it('should return expected shape with successful round-trip and rotation', () => {
      const result = service.demonstrate();
      expect(result.original).toBeDefined();
      expect(result.masterKey).toBeDefined();
      expect(result.envelope).toBeDefined();
      expect(result.decrypted).toBe(result.original);
      expect(result.roundTripSuccess).toBe(true);
      expect(result.keyRotation).toBeDefined();
      expect(result.keyRotation.rotationSuccess).toBe(true);
      expect(result.keyRotation.oldKeyFails).toBe(true);
    });
  });
});
