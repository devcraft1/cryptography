import { Test, TestingModule } from '@nestjs/testing';
import { HmacService } from './hmac.service';

describe('HmacService', () => {
  let service: HmacService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HmacService],
    }).compile();

    service = module.get<HmacService>(HmacService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateHmac', () => {
    it('should generate a valid HMAC', () => {
      const message = 'test message';
      const key = 'secret key';

      const hmac = service.generateHmac(message, key);

      expect(hmac).toBeDefined();
      expect(typeof hmac).toBe('string');
      expect(hmac.length).toBeGreaterThan(0);
    });

    it('should generate different HMACs for different messages', () => {
      const key = 'secret key';
      const message1 = 'message 1';
      const message2 = 'message 2';

      const hmac1 = service.generateHmac(message1, key);
      const hmac2 = service.generateHmac(message2, key);

      expect(hmac1).not.toBe(hmac2);
    });

    it('should generate different HMACs for different keys', () => {
      const message = 'test message';
      const key1 = 'key 1';
      const key2 = 'key 2';

      const hmac1 = service.generateHmac(message, key1);
      const hmac2 = service.generateHmac(message, key2);

      expect(hmac1).not.toBe(hmac2);
    });

    it('should generate consistent HMACs for same message and key', () => {
      const message = 'test message';
      const key = 'secret key';

      const hmac1 = service.generateHmac(message, key);
      const hmac2 = service.generateHmac(message, key);

      expect(hmac1).toBe(hmac2);
    });
  });

  describe('verifyHmac', () => {
    it('should verify valid HMAC', () => {
      const message = 'test message';
      const key = 'secret key';

      const hmac = service.generateHmac(message, key);
      const isValid = service.verifyHmac(message, key, hmac);

      expect(isValid).toBe(true);
    });

    it('should reject invalid HMAC', () => {
      const message = 'test message';
      const key = 'secret key';
      const invalidHmac = 'invalid-hmac-value';

      const isValid = service.verifyHmac(message, key, invalidHmac);

      expect(isValid).toBe(false);
    });

    it('should reject HMAC with wrong key', () => {
      const message = 'test message';
      const correctKey = 'correct key';
      const wrongKey = 'wrong key';

      const hmac = service.generateHmac(message, correctKey);
      const isValid = service.verifyHmac(message, wrongKey, hmac);

      expect(isValid).toBe(false);
    });

    it('should reject HMAC with tampered message', () => {
      const originalMessage = 'original message';
      const tamperedMessage = 'tampered message';
      const key = 'secret key';

      const hmac = service.generateHmac(originalMessage, key);
      const isValid = service.verifyHmac(tamperedMessage, key, hmac);

      expect(isValid).toBe(false);
    });
  });

  describe('generateSecretKey', () => {
    it('should generate a secret key', () => {
      const key = service.generateSecretKey();

      expect(key).toBeDefined();
      expect(typeof key).toBe('string');
      expect(key.length).toBe(64); // 32 bytes * 2 (hex encoding)
    });

    it('should generate different keys each time', () => {
      const key1 = service.generateSecretKey();
      const key2 = service.generateSecretKey();

      expect(key1).not.toBe(key2);
    });

    it('should generate key with specified length', () => {
      const length = 16;
      const key = service.generateSecretKey(length);

      expect(key.length).toBe(length * 2); // length * 2 (hex encoding)
    });
  });

  describe('demonstrateHmac', () => {
    it('should return demonstration object with valid HMAC', () => {
      const demo = service.demonstrateHmac();

      expect(demo).toBeDefined();
      expect(demo.message).toBeDefined();
      expect(demo.key).toBeDefined();
      expect(demo.hmac).toBeDefined();
      expect(demo.isValid).toBe(true);
      expect(demo.demonstration).toContain(
        'HMAC ensures message integrity and authenticity',
      );
    });
  });
});
