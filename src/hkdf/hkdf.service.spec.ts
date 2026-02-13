import { Test, TestingModule } from '@nestjs/testing';
import { HkdfService } from './hkdf.service';

describe('HkdfService', () => {
  let service: HkdfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HkdfService],
    }).compile();

    service = module.get<HkdfService>(HkdfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('derive', () => {
    it('should produce a hex string of correct length', () => {
      const result = service.derive('test-ikm', 'test-salt', 'test-info');

      expect(result.derivedKey).toBeDefined();
      expect(typeof result.derivedKey).toBe('string');
      expect(result.derivedKey.length).toBe(64); // 32 bytes * 2 (hex encoding)
      expect(result.keyLength).toBe(32);
      expect(result.hash).toBe('sha256');
    });

    it('should be deterministic (same inputs produce same output)', () => {
      const result1 = service.derive('test-ikm', 'test-salt', 'test-info');
      const result2 = service.derive('test-ikm', 'test-salt', 'test-info');

      expect(result1.derivedKey).toBe(result2.derivedKey);
    });

    it('should produce different key when salt differs', () => {
      const result1 = service.derive('test-ikm', 'salt-one', 'test-info');
      const result2 = service.derive('test-ikm', 'salt-two', 'test-info');

      expect(result1.derivedKey).not.toBe(result2.derivedKey);
    });

    it('should produce different key when info differs', () => {
      const result1 = service.derive('test-ikm', 'test-salt', 'info-one');
      const result2 = service.derive('test-ikm', 'test-salt', 'info-two');

      expect(result1.derivedKey).not.toBe(result2.derivedKey);
    });

    it('should respect custom keyLength', () => {
      const result = service.derive('test-ikm', 'test-salt', 'test-info', 16);

      expect(result.derivedKey.length).toBe(32); // 16 bytes * 2 (hex encoding)
      expect(result.keyLength).toBe(16);
    });

    it('should respect custom hash algorithm', () => {
      const result = service.derive(
        'test-ikm',
        'test-salt',
        'test-info',
        32,
        'sha512',
      );

      expect(result.hash).toBe('sha512');
      expect(result.derivedKey.length).toBe(64); // 32 bytes * 2 (hex encoding)
    });
  });

  describe('deriveMultiple', () => {
    it('should return the correct number of keys', () => {
      const labels = ['key-1', 'key-2', 'key-3'];
      const result = service.deriveMultiple('test-ikm', 'test-salt', labels);

      expect(result.keys).toBeDefined();
      expect(result.keys.length).toBe(3);
      expect(result.keys[0].label).toBe('key-1');
      expect(result.keys[1].label).toBe('key-2');
      expect(result.keys[2].label).toBe('key-3');
    });

    it('should produce keys that are all different from each other', () => {
      const labels = ['encryption-key', 'mac-key', 'iv'];
      const result = service.deriveMultiple('test-ikm', 'test-salt', labels);

      const derivedKeys = result.keys.map((k) => k.derivedKey);
      const uniqueKeys = new Set(derivedKeys);

      expect(uniqueKeys.size).toBe(derivedKeys.length);
    });

    it('should be deterministic for same inputs', () => {
      const labels = ['key-a', 'key-b'];
      const result1 = service.deriveMultiple('test-ikm', 'test-salt', labels);
      const result2 = service.deriveMultiple('test-ikm', 'test-salt', labels);

      expect(result1.keys[0].derivedKey).toBe(result2.keys[0].derivedKey);
      expect(result1.keys[1].derivedKey).toBe(result2.keys[1].derivedKey);
    });
  });

  describe('demonstrate', () => {
    it('should return expected shape', () => {
      const demo = service.demonstrate();

      expect(demo).toBeDefined();
      expect(demo.basicDerivation).toBeDefined();
      expect(demo.basicDerivation.derivedKey).toBeDefined();
      expect(demo.basicDerivation.description).toBeDefined();

      expect(demo.multipleKeyDerivation).toBeDefined();
      expect(demo.multipleKeyDerivation.keys).toBeDefined();
      expect(demo.multipleKeyDerivation.keys.length).toBe(3);

      expect(demo.deterministic).toBeDefined();
      expect(demo.deterministic.isDeterministic).toBe(true);
      expect(demo.deterministic.key1).toBe(demo.deterministic.key2);

      expect(demo.differentInfoDifferentKeys).toBeDefined();
      expect(
        demo.differentInfoDifferentKeys.differentInfoProducesDifferentKeys,
      ).toBe(true);
      expect(demo.differentInfoDifferentKeys.keyA).not.toBe(
        demo.differentInfoDifferentKeys.keyB,
      );

      expect(demo.demonstration).toContain('HKDF');
      expect(demo.demonstration).toContain('RFC 5869');
    });
  });
});
