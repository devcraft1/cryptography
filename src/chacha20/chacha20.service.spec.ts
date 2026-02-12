import { Test, TestingModule } from '@nestjs/testing';
import { ChaCha20Service } from './chacha20.service';

describe('ChaCha20Service', () => {
  let service: ChaCha20Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChaCha20Service],
    }).compile();

    service = module.get<ChaCha20Service>(ChaCha20Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('encrypt', () => {
    it('should return ciphertext, key, iv, and authTag as hex strings', () => {
      const result = service.encrypt('hello world');

      expect(result).toHaveProperty('ciphertext');
      expect(result).toHaveProperty('key');
      expect(result).toHaveProperty('iv');
      expect(result).toHaveProperty('authTag');

      // Verify hex encoding: all characters should be valid hex
      const hexRegex = /^[0-9a-f]+$/;
      expect(result.ciphertext).toMatch(hexRegex);
      expect(result.key).toMatch(hexRegex);
      expect(result.iv).toMatch(hexRegex);
      expect(result.authTag).toMatch(hexRegex);

      // Verify expected lengths (hex = 2 chars per byte)
      expect(result.key).toHaveLength(64); // 32 bytes
      expect(result.iv).toHaveLength(24); // 12 bytes
      expect(result.authTag).toHaveLength(32); // 16 bytes
    });
  });

  describe('decrypt', () => {
    it('should round-trip correctly', () => {
      const plaintext = 'The quick brown fox jumps over the lazy dog';
      const encrypted = service.encrypt(plaintext);
      const decrypted = service.decrypt(
        encrypted.ciphertext,
        encrypted.key,
        encrypted.iv,
        encrypted.authTag,
      );

      expect(decrypted.plaintext).toBe(plaintext);
      expect(decrypted.algorithm).toBe('chacha20-poly1305');
    });
  });

  describe('encrypt/decrypt with AAD', () => {
    it('should encrypt and decrypt with the same AAD', () => {
      const plaintext = 'authenticated data test';
      const aad = 'additional-context-header';

      const encrypted = service.encrypt(plaintext, aad);
      expect(encrypted.aad).toBe(aad);

      const decrypted = service.decrypt(
        encrypted.ciphertext,
        encrypted.key,
        encrypted.iv,
        encrypted.authTag,
        aad,
      );

      expect(decrypted.plaintext).toBe(plaintext);
    });

    it('should throw when decrypting with wrong AAD', () => {
      const plaintext = 'authenticated data test';
      const aad = 'correct-aad';

      const encrypted = service.encrypt(plaintext, aad);

      expect(() =>
        service.decrypt(
          encrypted.ciphertext,
          encrypted.key,
          encrypted.iv,
          encrypted.authTag,
          'wrong-aad',
        ),
      ).toThrow();
    });
  });

  describe('tamper detection', () => {
    it('should throw when ciphertext is tampered', () => {
      const encrypted = service.encrypt('sensitive data');

      // Flip a byte in the ciphertext
      const tampered = Buffer.from(encrypted.ciphertext, 'hex');
      tampered[0] ^= 0xff;

      expect(() =>
        service.decrypt(
          tampered.toString('hex'),
          encrypted.key,
          encrypted.iv,
          encrypted.authTag,
        ),
      ).toThrow();
    });

    it('should throw when decrypting with wrong key', () => {
      const encrypted = service.encrypt('sensitive data');

      // Generate a different key
      const wrongKey = Buffer.alloc(32, 0).toString('hex');

      expect(() =>
        service.decrypt(
          encrypted.ciphertext,
          wrongKey,
          encrypted.iv,
          encrypted.authTag,
        ),
      ).toThrow();
    });
  });

  describe('demonstrate', () => {
    it('should return expected shape with tamperDetected=true and matching decrypted text', () => {
      const result = service.demonstrate();

      expect(result).toHaveProperty('original');
      expect(result).toHaveProperty('ciphertext');
      expect(result).toHaveProperty('decrypted');
      expect(result).toHaveProperty('tamperDetected');
      expect(result).toHaveProperty('algorithm');
      expect(result).toHaveProperty('description');

      expect(result.decrypted).toBe(result.original);
      expect(result.tamperDetected).toBe(true);
      expect(result.algorithm).toBe('chacha20-poly1305');
    });
  });
});
