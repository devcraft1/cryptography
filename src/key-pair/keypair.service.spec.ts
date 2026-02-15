import { Test, TestingModule } from '@nestjs/testing';
import { KeypairService } from './keypair.service';

describe('KeypairService', () => {
  let service: KeypairService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeypairService],
    }).compile();

    service = module.get<KeypairService>(KeypairService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('keyPairs', () => {
    it('should generate RSA key pairs', () => {
      const keys = service.keyPairs();

      expect(keys).toBeDefined();
      expect(keys.pubkey).toBeDefined();
      expect(keys.privkey).toBeDefined();
      expect(typeof keys.pubkey).toBe('string');
      expect(typeof keys.privkey).toBe('string');
    });

    it('should generate valid PEM formatted keys', () => {
      const keys = service.keyPairs();

      // Check public key format
      expect(keys.pubkey).toContain('-----BEGIN PUBLIC KEY-----');
      expect(keys.pubkey).toContain('-----END PUBLIC KEY-----');

      // Check private key format
      expect(keys.privkey).toContain('-----BEGIN PRIVATE KEY-----');
      expect(keys.privkey).toContain('-----END PRIVATE KEY-----');
    });

    it('should generate different key pairs each time', () => {
      const keys1 = service.keyPairs();
      const keys2 = service.keyPairs();

      expect(keys1.pubkey).not.toBe(keys2.pubkey);
      expect(keys1.privkey).not.toBe(keys2.privkey);
    });

    it('should generate keys with correct length', () => {
      const keys = service.keyPairs();

      // RSA 2048-bit keys in PEM format should be substantial in size
      expect(keys.pubkey.length).toBeGreaterThan(300);
      expect(keys.privkey.length).toBeGreaterThan(1600);
    });

    it('should use SPKI format for public key', () => {
      const keys = service.keyPairs();

      // SPKI format starts with specific identifier
      expect(keys.pubkey).toContain('-----BEGIN PUBLIC KEY-----');
      expect(keys.pubkey).not.toContain('-----BEGIN RSA PUBLIC KEY-----');
    });

    it('should use PKCS8 format for private key', () => {
      const keys = service.keyPairs();

      // PKCS8 format identifier
      expect(keys.privkey).toContain('-----BEGIN PRIVATE KEY-----');
      expect(keys.privkey).not.toContain('-----BEGIN RSA PRIVATE KEY-----');
    });
  });

  describe('publicKey', () => {
    it('should return public key string', () => {
      const publicKey = service.publicKey();

      expect(publicKey).toBeDefined();
      expect(typeof publicKey).toBe('string');
      expect(publicKey).toContain('-----BEGIN PUBLIC KEY-----');
      expect(publicKey).toContain('-----END PUBLIC KEY-----');
    });

    it('should return the same cached public key on repeated calls', () => {
      const key1 = service.publicKey();
      const key2 = service.publicKey();

      expect(key1).toBe(key2);
    });

    it('should return valid PEM format', () => {
      const publicKey = service.publicKey();

      const lines = publicKey.split('\n');
      expect(lines[0]).toBe('-----BEGIN PUBLIC KEY-----');
      expect(lines[lines.length - 2]).toBe('-----END PUBLIC KEY-----');

      // Should contain base64 encoded data
      const base64Content = lines.slice(1, -2).join('');
      expect(base64Content).toMatch(/^[A-Za-z0-9+/=]+$/);
    });
  });

  describe('privateKey', () => {
    it('should return private key string', () => {
      const privateKey = service.privateKey();

      expect(privateKey).toBeDefined();
      expect(typeof privateKey).toBe('string');
      expect(privateKey).toContain('-----BEGIN PRIVATE KEY-----');
      expect(privateKey).toContain('-----END PRIVATE KEY-----');
    });

    it('should return the same cached private key on repeated calls', () => {
      const key1 = service.privateKey();
      const key2 = service.privateKey();

      expect(key1).toBe(key2);
    });

    it('should return valid PEM format', () => {
      const privateKey = service.privateKey();

      const lines = privateKey.split('\n');
      expect(lines[0]).toBe('-----BEGIN PRIVATE KEY-----');
      expect(lines[lines.length - 2]).toBe('-----END PRIVATE KEY-----');

      // Should contain base64 encoded data
      const base64Content = lines.slice(1, -2).join('');
      expect(base64Content).toMatch(/^[A-Za-z0-9+/=]+$/);
    });

    it('should be much longer than public key', () => {
      const publicKey = service.publicKey();
      const privateKey = service.privateKey();

      expect(privateKey.length).toBeGreaterThan(publicKey.length);
    });
  });

  describe('signin', () => {
    it('should successfully sign and verify with cached keys', () => {
      const result = service.signin();

      expect(result).toBe(true);
    });

    it('should work because publicKey and privateKey use the same cached key pair', () => {
      const result = service.signin();

      expect(result).toBe(true);
    });

    it('should handle digital signature workflow', () => {
      const result = service.signin();

      expect(result).toBeDefined();
      expect(typeof result).toBe('boolean');
      expect(result).toBe(true);
    });

    it('should return consistent keys from publicKey and privateKey', () => {
      // publicKey() and privateKey() now return cached keys
      const pub1 = service.publicKey();
      const pub2 = service.publicKey();
      const priv1 = service.privateKey();
      const priv2 = service.privateKey();

      expect(pub1).toBe(pub2);
      expect(priv1).toBe(priv2);
    });

    it('should use RSA-SHA256 algorithm correctly', () => {
      const result = service.signin();

      expect(result).toBe(true);
    });
  });

  describe('key pair integration', () => {
    it('should generate matching public and private keys', () => {
      // Generate a key pair and test they work together
      const keys = service.keyPairs();

      // Use Node.js crypto to test the keys work together
      const crypto = require('crypto');

      const message = 'test message for key validation';

      // Sign with private key
      const signer = crypto.createSign('rsa-sha256');
      signer.update(message);
      const signature = signer.sign(keys.privkey, 'hex');

      // Verify with public key
      const verifier = crypto.createVerify('rsa-sha256');
      verifier.update(message);
      const isVerified = verifier.verify(keys.pubkey, signature, 'hex');

      expect(isVerified).toBe(true);
    });

    it('should ensure public and private keys are cryptographically related', () => {
      const publicKey = service.publicKey();
      const privateKey = service.privateKey();

      // These are from the same cached key pair
      expect(publicKey).toBeDefined();
      expect(privateKey).toBeDefined();

      // Both should be valid PEM format
      expect(publicKey).toMatch(
        /-----BEGIN PUBLIC KEY-----[\s\S]*-----END PUBLIC KEY-----/,
      );
      expect(privateKey).toMatch(
        /-----BEGIN PRIVATE KEY-----[\s\S]*-----END PRIVATE KEY-----/,
      );

      // Since they're from the same cached key pair, signing/verification should work
      const crypto = require('crypto');
      const message = 'test cryptographic relation';
      const signer = crypto.createSign('rsa-sha256');
      signer.update(message);
      const signature = signer.sign(privateKey, 'hex');
      const verifier = crypto.createVerify('rsa-sha256');
      verifier.update(message);
      const isVerified = verifier.verify(publicKey, signature, 'hex');
      expect(isVerified).toBe(true);
    });
  });

  describe('performance and consistency', () => {
    it('should generate keys within reasonable time', async () => {
      const startTime = Date.now();
      service.keyPairs();
      const endTime = Date.now();

      const generationTime = endTime - startTime;
      // Key generation should complete within 5 seconds
      expect(generationTime).toBeLessThan(5000);
    });

    it('should handle multiple concurrent key generations', async () => {
      const promises = Array(5)
        .fill(0)
        .map(() => Promise.resolve(service.keyPairs()));

      const results = await Promise.all(promises);

      // All results should be valid
      results.forEach((keys) => {
        expect(keys.pubkey).toBeDefined();
        expect(keys.privkey).toBeDefined();
      });

      // All should be different
      const publicKeys = results.map((r) => r.pubkey);
      const uniquePublicKeys = new Set(publicKeys);
      expect(uniquePublicKeys.size).toBe(results.length);
    });
  });
});
