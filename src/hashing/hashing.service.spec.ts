import { Test, TestingModule } from '@nestjs/testing';
import { HashingService } from './hashing.service';

describe('HashingService', () => {
  let service: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashingService],
    }).compile();

    service = module.get<HashingService>(HashingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hash', () => {
    it('should hash a string input', () => {
      const input = 'test input';
      const hash = service.hash({ input });

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should produce consistent hashes for same input', () => {
      const input = 'consistent input';
      const hash1 = service.hash({ input });
      const hash2 = service.hash({ input });

      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different inputs', () => {
      const input1 = 'input 1';
      const input2 = 'input 2';

      const hash1 = service.hash({ input: input1 });
      const hash2 = service.hash({ input: input2 });

      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty string', () => {
      const input = '';
      const hash = service.hash({ input });

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should handle special characters', () => {
      const input = '!@#$%^&*()_+{}|:<>?[]\\;\'".,/~`';
      const hash = service.hash({ input });

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
    });

    it('should use SHA256 algorithm', () => {
      const input = 'test';
      const hash = service.hash({ input });

      // SHA256 in base64 should be around 44 characters
      expect(hash.length).toBe(44);
      // Base64 should end with = or == for padding
      expect(hash).toMatch(/^[A-Za-z0-9+/]+=*$/);
    });

    it('should handle unicode characters', () => {
      const input = '测试 🚀 émojis';
      const hash = service.hash({ input });

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(44);
    });

    it('should be deterministic', () => {
      const input = 'deterministic test';
      const results = [];

      // Generate multiple hashes
      for (let i = 0; i < 10; i++) {
        results.push(service.hash({ input }));
      }

      // All should be identical
      const firstHash = results[0];
      results.forEach((hash) => {
        expect(hash).toBe(firstHash);
      });
    });
  });

  describe('compare', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('should attempt hash comparison but fail due to wrong parameter type', () => {
      // The compare method has a bug - it passes a string to hash() which expects a DTO
      expect(() => service.compare()).toThrow();
    });

    it('should demonstrate that compare method has a bug', () => {
      // This test documents that the compare method incorrectly calls hash with a string
      const hashSpy = jest.spyOn(service, 'hash');

      expect(() => service.compare()).toThrow();
      expect(hashSpy).toHaveBeenCalledWith('hi-mom!'); // Bug: should be {input: 'hi-mom!'}
    });
  });

  describe('hmac', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('should generate HMAC with different keys', () => {
      service.hmac();

      expect(consoleSpy).toHaveBeenCalledTimes(2);

      // Should log two different HMACs
      const firstHmac = consoleSpy.mock.calls[0][0];
      const secondHmac = consoleSpy.mock.calls[1][0];

      expect(firstHmac).toBeDefined();
      expect(secondHmac).toBeDefined();
      expect(firstHmac).not.toBe(secondHmac);
      expect(typeof firstHmac).toBe('string');
      expect(typeof secondHmac).toBe('string');
    });

    it('should use SHA256 for HMAC', () => {
      service.hmac();

      // HMAC-SHA256 in hex should be 64 characters
      const firstHmac = consoleSpy.mock.calls[0][0];
      const secondHmac = consoleSpy.mock.calls[1][0];

      expect(firstHmac.length).toBe(64);
      expect(secondHmac.length).toBe(64);
      expect(firstHmac).toMatch(/^[a-f0-9]+$/);
      expect(secondHmac).toMatch(/^[a-f0-9]+$/);
    });

    it('should demonstrate that different keys produce different HMACs', () => {
      service.hmac();

      const firstHmac = consoleSpy.mock.calls[0][0];
      const secondHmac = consoleSpy.mock.calls[1][0];

      // With same message but different keys, HMACs should be different
      expect(firstHmac).not.toBe(secondHmac);
    });
  });

  describe('integration with other methods', () => {
    it('should work with hash method for password verification simulation', () => {
      const password = 'testPassword123';
      const hash1 = service.hash({ input: password });
      const hash2 = service.hash({ input: password });

      // Same password should produce same hash
      expect(hash1).toBe(hash2);

      // Different password should produce different hash
      const differentHash = service.hash({ input: 'differentPassword' });
      expect(hash1).not.toBe(differentHash);
    });

    it('should handle large inputs', () => {
      const largeInput = 'a'.repeat(10000);
      const hash = service.hash({ input: largeInput });

      expect(hash).toBeDefined();
      expect(hash.length).toBe(44); // SHA256 base64 is always 44 chars
    });

    it('should be suitable for password hashing verification', () => {
      const passwords = [
        'short',
        'averyverylongpasswordwithlotsofcharacters',
        'Pa$$w0rd!@#',
        '12345',
        'пароль', // Russian
        '密码', // Chinese
        '🔒🗝️🛡️', // Emojis
      ];

      passwords.forEach((password) => {
        const hash = service.hash({ input: password });
        expect(hash).toBeDefined();
        expect(hash.length).toBe(44);

        // Verify consistency
        const hash2 = service.hash({ input: password });
        expect(hash).toBe(hash2);
      });
    });
  });
});
