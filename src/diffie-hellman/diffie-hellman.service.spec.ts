import { Test, TestingModule } from '@nestjs/testing';
import { DiffieHellmanService } from './diffie-hellman.service';

describe('DiffieHellmanService', () => {
  let service: DiffieHellmanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiffieHellmanService],
    }).compile();
    service = module.get<DiffieHellmanService>(DiffieHellmanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('classicDH', () => {
    it('should produce matching shared secrets', () => {
      const result = service.classicDH();
      expect(result.secretsMatch).toBe(true);
      expect(result.algorithm).toBe('Diffie-Hellman');
    });
  });

  describe('ecdhKeyExchange', () => {
    it('should produce matching shared secrets with default curve', () => {
      const result = service.ecdhKeyExchange();
      expect(result.secretsMatch).toBe(true);
      expect(result.algorithm).toBe('ECDH');
      expect(result.curve).toBe('secp256k1');
    });

    it('should work with prime256v1 curve', () => {
      const result = service.ecdhKeyExchange('prime256v1');
      expect(result.secretsMatch).toBe(true);
      expect(result.curve).toBe('prime256v1');
    });

    it('should generate different keys each time', () => {
      const a = service.ecdhKeyExchange();
      const b = service.ecdhKeyExchange();
      expect(a.alice.publicKey).not.toBe(b.alice.publicKey);
    });
  });

  describe('demonstrate', () => {
    it('should return ECDH demo with matching secrets', () => {
      const result = service.demonstrate();
      expect(result.ecdh.secretsMatch).toBe(true);
    });
  });
});
