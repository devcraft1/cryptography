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

      expect(hash.length).toBe(44);
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

      for (let i = 0; i < 10; i++) {
        results.push(service.hash({ input }));
      }

      const firstHash = results[0];
      results.forEach((hash) => {
        expect(hash).toBe(firstHash);
      });
    });
  });

  describe('compare', () => {
    it('should return true for matching hashes', () => {
      const result = service.compare();
      expect(result).toBe(true);
    });

    it('should correctly hash with DTO and compare identical passwords', () => {
      const hashSpy = jest.spyOn(service, 'hash');

      const result = service.compare();

      expect(result).toBe(true);
      expect(hashSpy).toHaveBeenCalledWith({ input: 'hi-mom!' });
      expect(hashSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('integration', () => {
    it('should work with hash method for password verification simulation', () => {
      const password = 'testPassword123';
      const hash1 = service.hash({ input: password });
      const hash2 = service.hash({ input: password });

      expect(hash1).toBe(hash2);

      const differentHash = service.hash({ input: 'differentPassword' });
      expect(hash1).not.toBe(differentHash);
    });

    it('should handle large inputs', () => {
      const largeInput = 'a'.repeat(10000);
      const hash = service.hash({ input: largeInput });

      expect(hash).toBeDefined();
      expect(hash.length).toBe(44);
    });

    it('should be suitable for password hashing verification', () => {
      const passwords = [
        'short',
        'averyverylongpasswordwithlotsofcharacters',
        'Pa$$w0rd!@#',
        '12345',
        'пароль',
        '密码',
        '🔒🗝️🛡️',
      ];

      passwords.forEach((password) => {
        const hash = service.hash({ input: password });
        expect(hash).toBeDefined();
        expect(hash.length).toBe(44);

        const hash2 = service.hash({ input: password });
        expect(hash).toBe(hash2);
      });
    });
  });
});
