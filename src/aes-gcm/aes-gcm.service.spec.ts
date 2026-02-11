import { Test, TestingModule } from '@nestjs/testing';
import { AesGcmService } from './aes-gcm.service';

describe('AesGcmService', () => {
  let service: AesGcmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AesGcmService],
    }).compile();
    service = module.get<AesGcmService>(AesGcmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('encrypt', () => {
    it('should encrypt and return ciphertext, iv, authTag, key', () => {
      const result = service.encrypt('hello world');
      expect(result.ciphertext).toBeDefined();
      expect(result.iv).toBeDefined();
      expect(result.authTag).toBeDefined();
      expect(result.key).toBeDefined();
      expect(result.algorithm).toBe('AES-256-GCM');
    });

    it('should accept a provided key', () => {
      const key = 'a'.repeat(64);
      const result = service.encrypt('test', key);
      expect(result.key).toBe(key);
    });

    it('should produce different ciphertexts for same plaintext', () => {
      const a = service.encrypt('same text');
      const b = service.encrypt('same text');
      expect(a.ciphertext).not.toBe(b.ciphertext);
    });
  });

  describe('decrypt', () => {
    it('should decrypt ciphertext back to plaintext', () => {
      const encrypted = service.encrypt('hello world');
      const decrypted = service.decrypt(
        encrypted.ciphertext,
        encrypted.key,
        encrypted.iv,
        encrypted.authTag,
      );
      expect(decrypted.plaintext).toBe('hello world');
    });

    it('should fail with wrong auth tag', () => {
      const encrypted = service.encrypt('test');
      expect(() =>
        service.decrypt(
          encrypted.ciphertext,
          encrypted.key,
          encrypted.iv,
          'ff'.repeat(16),
        ),
      ).toThrow();
    });

    it('should fail with wrong key', () => {
      const encrypted = service.encrypt('test');
      expect(() =>
        service.decrypt(
          encrypted.ciphertext,
          'bb'.repeat(32),
          encrypted.iv,
          encrypted.authTag,
        ),
      ).toThrow();
    });
  });

  describe('demonstrate', () => {
    it('should show encrypt/decrypt cycle and tamper detection', () => {
      const result = service.demonstrate();
      expect(result.decrypted).toBe(result.original);
      expect(result.tamperDetected).toBe(true);
    });
  });
});
