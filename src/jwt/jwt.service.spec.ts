import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from './jwt.service';

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtService],
    }).compile();
    service = module.get<JwtService>(JwtService);
    service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('HS256', () => {
    const payload = { sub: '123', name: 'Test' };
    const secret = 'test-secret';

    it('should sign and produce a JWT token', () => {
      const result = service.signHs256(payload, secret);
      expect(result.token).toBeDefined();
      const parts = result.token.split('.');
      expect(parts).toHaveLength(3);
    });

    it('should verify a valid token', () => {
      const { token } = service.signHs256(payload, secret);
      const result = service.verify(token, secret, 'HS256');
      expect(result.isValid).toBe(true);
      expect(result.payload.sub).toBe('123');
      expect(result.payload.name).toBe('Test');
    });

    it('should reject token with wrong secret', () => {
      const { token } = service.signHs256(payload, secret);
      const result = service.verify(token, 'wrong-secret', 'HS256');
      expect(result.isValid).toBe(false);
    });

    it('should reject tampered token', () => {
      const { token } = service.signHs256(payload, secret);
      const tampered = token.slice(0, -1) + 'X';
      const result = service.verify(tampered, secret, 'HS256');
      expect(result.isValid).toBe(false);
    });
  });

  describe('RS256', () => {
    const payload = { sub: '456', role: 'admin' };

    it('should sign and return token with public key', () => {
      const result = service.signRs256(payload);
      expect(result.token).toBeDefined();
      expect(result.publicKey).toContain('BEGIN PUBLIC KEY');
    });

    it('should verify a valid RS256 token', () => {
      const { token, publicKey } = service.signRs256(payload);
      const result = service.verify(token, publicKey, 'RS256');
      expect(result.isValid).toBe(true);
      expect(result.payload.sub).toBe('456');
    });

    it('should reject RS256 token with wrong key', async () => {
      const { token } = service.signRs256(payload);
      const { publicKey: wrongKey } = await service.generateFreshKeyPair();
      const result = service.verify(token, wrongKey, 'RS256');
      expect(result.isValid).toBe(false);
    });
  });

  describe('generateFreshKeyPair', () => {
    it('should generate a valid RSA key pair', async () => {
      const keyPair = await service.generateFreshKeyPair();
      expect(keyPair.publicKey).toContain('BEGIN PUBLIC KEY');
      expect(keyPair.privateKey).toContain('BEGIN PRIVATE KEY');
    });

    it('should generate different key pairs each time', async () => {
      const keyPair1 = await service.generateFreshKeyPair();
      const keyPair2 = await service.generateFreshKeyPair();
      expect(keyPair1.publicKey).not.toBe(keyPair2.publicKey);
    });
  });

  describe('decode', () => {
    it('should decode without verification', () => {
      const { token } = service.signHs256({ data: 'test' }, 'secret');
      const result = service.decode(token);
      expect(result.header.alg).toBe('HS256');
      expect(result.header.typ).toBe('JWT');
      expect(result.payload.data).toBe('test');
      expect(result.warning).toContain('NOT verify');
    });

    it('should throw on invalid format', () => {
      expect(() => service.decode('invalid')).toThrow();
    });
  });

  describe('demonstrate', () => {
    it('should demonstrate HS256, RS256, and tamper detection', () => {
      const result = service.demonstrate();
      expect(result.hs256.isValid).toBe(true);
      expect(result.rs256.isValid).toBe(true);
      expect(result.tamperedToken.isValid).toBe(false);
    });
  });
});
