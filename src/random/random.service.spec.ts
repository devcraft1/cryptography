import { Test, TestingModule } from '@nestjs/testing';
import { RandomService } from './random.service';

describe('RandomService', () => {
  let service: RandomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RandomService],
    }).compile();
    service = module.get<RandomService>(RandomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateBytes', () => {
    it('should generate random bytes of specified size', () => {
      const result = service.generateBytes(16);
      expect(result.hex).toHaveLength(32);
      expect(result.size).toBe(16);
    });

    it('should default to 32 bytes', () => {
      const result = service.generateBytes();
      expect(result.hex).toHaveLength(64);
      expect(result.size).toBe(32);
    });

    it('should generate different values each time', () => {
      const a = service.generateBytes(16);
      const b = service.generateBytes(16);
      expect(a.hex).not.toBe(b.hex);
    });
  });

  describe('generateUuid', () => {
    it('should generate a valid UUID v4', () => {
      const result = service.generateUuid();
      expect(result.uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
      expect(result.version).toBe(4);
    });

    it('should generate unique UUIDs', () => {
      const a = service.generateUuid();
      const b = service.generateUuid();
      expect(a.uuid).not.toBe(b.uuid);
    });
  });

  describe('generateInt', () => {
    it('should generate an integer in range', () => {
      const result = service.generateInt(1, 10);
      expect(result.value).toBeGreaterThanOrEqual(1);
      expect(result.value).toBeLessThan(10);
    });

    it('should use defaults', () => {
      const result = service.generateInt();
      expect(result.value).toBeGreaterThanOrEqual(0);
      expect(result.value).toBeLessThan(100);
    });
  });

  describe('demonstrate', () => {
    it('should return all random generation types', () => {
      const result = service.demonstrate();
      expect(result.bytes).toBeDefined();
      expect(result.uuid).toBeDefined();
      expect(result.integer).toBeDefined();
      expect(result.warning).toContain('Math.random()');
    });
  });
});
