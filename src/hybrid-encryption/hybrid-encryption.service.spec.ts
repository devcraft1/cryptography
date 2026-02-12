import { Test, TestingModule } from '@nestjs/testing';
import { HybridEncryptionService } from './hybrid-encryption.service';

describe('HybridEncryptionService', () => {
  let service: HybridEncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HybridEncryptionService],
    }).compile();
    service = module.get<HybridEncryptionService>(HybridEncryptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateKeyPair', () => {
    it('should return PEM-formatted public and private keys', () => {
      const { publicKey, privateKey } = service.generateKeyPair();
      expect(publicKey).toContain('-----BEGIN PUBLIC KEY-----');
      expect(publicKey).toContain('-----END PUBLIC KEY-----');
      expect(privateKey).toContain('-----BEGIN PRIVATE KEY-----');
      expect(privateKey).toContain('-----END PRIVATE KEY-----');
    });
  });

  describe('encrypt', () => {
    it('should return encryptedKey, ciphertext, iv, authTag as hex strings', () => {
      const { publicKey } = service.generateKeyPair();
      const result = service.encrypt('hello world', publicKey);

      expect(result.encryptedKey).toBeDefined();
      expect(result.ciphertext).toBeDefined();
      expect(result.iv).toBeDefined();
      expect(result.authTag).toBeDefined();
      expect(result.algorithm).toBe('RSA-OAEP + AES-256-GCM');

      expect(result.encryptedKey).toMatch(/^[0-9a-f]+$/);
      expect(result.ciphertext).toMatch(/^[0-9a-f]+$/);
      expect(result.iv).toMatch(/^[0-9a-f]+$/);
      expect(result.authTag).toMatch(/^[0-9a-f]+$/);
    });
  });

  describe('encrypt + decrypt round-trip', () => {
    it('should decrypt ciphertext back to original plaintext', () => {
      const { publicKey, privateKey } = service.generateKeyPair();
      const plaintext = 'The quick brown fox jumps over the lazy dog';

      const encrypted = service.encrypt(plaintext, publicKey);
      const decrypted = service.decrypt(
        encrypted.encryptedKey,
        encrypted.ciphertext,
        encrypted.iv,
        encrypted.authTag,
        privateKey,
      );

      expect(decrypted.plaintext).toBe(plaintext);
      expect(decrypted.algorithm).toBe('RSA-OAEP + AES-256-GCM');
    });
  });

  describe('decrypt with wrong private key', () => {
    it('should throw when decrypting with a different private key', () => {
      const { publicKey } = service.generateKeyPair();
      const { privateKey: wrongPrivateKey } = service.generateKeyPair();

      const encrypted = service.encrypt('secret message', publicKey);

      expect(() =>
        service.decrypt(
          encrypted.encryptedKey,
          encrypted.ciphertext,
          encrypted.iv,
          encrypted.authTag,
          wrongPrivateKey,
        ),
      ).toThrow();
    });
  });

  describe('demonstrate', () => {
    it('should return expected shape with match=true', () => {
      const result = service.demonstrate();

      expect(result.publicKey).toBeDefined();
      expect(result.encryptedKey).toBeDefined();
      expect(result.ciphertext).toBeDefined();
      expect(result.iv).toBeDefined();
      expect(result.authTag).toBeDefined();
      expect(result.decrypted).toBeDefined();
      expect(result.original).toBeDefined();
      expect(result.match).toBe(true);
      expect(result.algorithm).toBe('RSA-OAEP + AES-256-GCM');
      expect(result.description).toBeDefined();
    });
  });
});
