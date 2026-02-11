import { Test, TestingModule } from '@nestjs/testing';
import { SecretSharingService } from './secret-sharing.service';

describe('SecretSharingService', () => {
  let service: SecretSharingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecretSharingService],
    }).compile();
    service = module.get<SecretSharingService>(SecretSharingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('split and combine', () => {
    it('should split a secret into shares', () => {
      const result = service.split('hello', 5, 3);
      expect(result.shares).toHaveLength(5);
      expect(result.threshold).toBe(3);
      expect(result.totalShares).toBe(5);
    });

    it('should reconstruct secret with threshold shares', () => {
      const { shares } = service.split('secret message', 5, 3);
      const result = service.combine(shares.slice(0, 3));
      expect(result.secret).toBe('secret message');
    });

    it('should reconstruct with any subset of threshold shares', () => {
      const { shares } = service.split('test secret', 5, 3);
      const result = service.combine([shares[0], shares[2], shares[4]]);
      expect(result.secret).toBe('test secret');
    });

    it('should reconstruct with more than threshold shares', () => {
      const { shares } = service.split('test', 5, 3);
      const result = service.combine(shares.slice(0, 4));
      expect(result.secret).toBe('test');
    });

    it('should handle minimum shares (2 of 2)', () => {
      const { shares } = service.split('min', 2, 2);
      const result = service.combine(shares);
      expect(result.secret).toBe('min');
    });

    it('should reject threshold > totalShares', () => {
      expect(() => service.split('test', 3, 5)).toThrow();
    });

    it('should reject threshold < 2', () => {
      expect(() => service.split('test', 5, 1)).toThrow();
    });
  });

  describe('demonstrate', () => {
    it('should successfully demonstrate secret sharing', () => {
      const result = service.demonstrate();
      expect(result.reconstruction1.success).toBe(true);
      expect(result.reconstruction2.success).toBe(true);
      expect(result.threshold).toBe(3);
      expect(result.totalShares).toBe(5);
    });
  });
});
