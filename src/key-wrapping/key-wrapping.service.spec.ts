import { Test, TestingModule } from '@nestjs/testing';
import { KeyWrappingService } from './key-wrapping.service';

describe('KeyWrappingService', () => {
  let service: KeyWrappingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeyWrappingService],
    }).compile();
    service = module.get<KeyWrappingService>(KeyWrappingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateKek', () => {
    it('should return a 64-char hex string (32 bytes)', () => {
      const result = service.generateKek();
      expect(result.kek).toBeDefined();
      expect(result.kek).toHaveLength(64);
      expect(result.kek).toMatch(/^[0-9a-f]{64}$/);
    });
  });

  describe('generateDataKey', () => {
    it('should return correct default length (32 bytes = 64 hex chars)', () => {
      const result = service.generateDataKey();
      expect(result.dataKey).toHaveLength(64);
      expect(result.bytes).toBe(32);
    });

    it('should return correct length for custom byte size', () => {
      const result = service.generateDataKey(16);
      expect(result.dataKey).toHaveLength(32);
      expect(result.bytes).toBe(16);
    });
  });

  describe('wrap', () => {
    it('should return all required fields', () => {
      const { dataKey } = service.generateDataKey();
      const result = service.wrap(dataKey);
      expect(result.wrappedKey).toBeDefined();
      expect(result.kek).toBeDefined();
      expect(result.iv).toBeDefined();
      expect(result.authTag).toBeDefined();
      expect(result.algorithm).toBe('AES-256-GCM-WRAP');
    });

    it('should use provided KEK when given', () => {
      const { kek } = service.generateKek();
      const { dataKey } = service.generateDataKey();
      const result = service.wrap(dataKey, kek);
      expect(result.kek).toBe(kek);
    });

    it('should generate different wrapped keys for same input', () => {
      const { kek } = service.generateKek();
      const { dataKey } = service.generateDataKey();
      const a = service.wrap(dataKey, kek);
      const b = service.wrap(dataKey, kek);
      expect(a.wrappedKey).not.toBe(b.wrappedKey);
    });
  });

  describe('wrap + unwrap round-trip', () => {
    it('should unwrap to the original key', () => {
      const { dataKey } = service.generateDataKey();
      const wrapped = service.wrap(dataKey);
      const unwrapped = service.unwrap(
        wrapped.wrappedKey,
        wrapped.kek,
        wrapped.iv,
        wrapped.authTag,
      );
      expect(unwrapped.unwrappedKey).toBe(dataKey);
      expect(unwrapped.algorithm).toBe('AES-256-GCM-WRAP');
    });
  });

  describe('unwrap with wrong KEK', () => {
    it('should throw an error', () => {
      const { dataKey } = service.generateDataKey();
      const wrapped = service.wrap(dataKey);
      const wrongKek = service.generateKek().kek;
      expect(() =>
        service.unwrap(
          wrapped.wrappedKey,
          wrongKek,
          wrapped.iv,
          wrapped.authTag,
        ),
      ).toThrow();
    });
  });

  describe('unwrap with tampered wrappedKey', () => {
    it('should throw an error', () => {
      const { dataKey } = service.generateDataKey();
      const wrapped = service.wrap(dataKey);
      const tampered = 'ff'.repeat(wrapped.wrappedKey.length / 2);
      expect(() =>
        service.unwrap(tampered, wrapped.kek, wrapped.iv, wrapped.authTag),
      ).toThrow();
    });
  });

  describe('demonstrate', () => {
    it('should return expected shape with keysMatch=true and wrongKekFails=true', () => {
      const result = service.demonstrate();
      expect(result.kek).toBeDefined();
      expect(result.dataKey).toBeDefined();
      expect(result.wrappedKey).toBeDefined();
      expect(result.unwrappedKey).toBeDefined();
      expect(result.keysMatch).toBe(true);
      expect(result.wrongKekFails).toBe(true);
      expect(result.algorithm).toBe('AES-256-GCM-WRAP');
      expect(result.description).toBeDefined();
    });
  });
});
