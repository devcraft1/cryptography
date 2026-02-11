import { Test, TestingModule } from '@nestjs/testing';
import { EccService } from './ecc.service';

describe('EccService', () => {
  let service: EccService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EccService],
    }).compile();
    service = module.get<EccService>(EccService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateKeyPair', () => {
    it('should generate EC key pair with default curve', () => {
      const result = service.generateKeyPair();
      expect(result.publicKey).toContain('BEGIN PUBLIC KEY');
      expect(result.privateKey).toContain('BEGIN PRIVATE KEY');
      expect(result.curve).toBe('P-256');
    });

    it('should support P-384 curve', () => {
      const result = service.generateKeyPair('P-384');
      expect(result.curve).toBe('P-384');
      expect(result.publicKey).toContain('BEGIN PUBLIC KEY');
    });
  });

  describe('sign and verify', () => {
    it('should sign a message and verify it', () => {
      const keyPair = service.generateKeyPair();
      const signed = service.sign('test message', keyPair.privateKey);
      const verified = service.verify(
        'test message',
        signed.signature,
        keyPair.publicKey,
      );
      expect(verified.isValid).toBe(true);
    });

    it('should auto-generate keys if no private key provided', () => {
      const signed = service.sign('test message');
      expect(signed.signature).toBeDefined();
      expect(signed.publicKey).toBeDefined();
    });

    it('should reject tampered messages', () => {
      const keyPair = service.generateKeyPair();
      const signed = service.sign('original', keyPair.privateKey);
      const verified = service.verify(
        'tampered',
        signed.signature,
        keyPair.publicKey,
      );
      expect(verified.isValid).toBe(false);
    });

    it('should reject wrong public key', () => {
      const keyPair1 = service.generateKeyPair();
      const keyPair2 = service.generateKeyPair();
      const signed = service.sign('test', keyPair1.privateKey);
      const verified = service.verify(
        'test',
        signed.signature,
        keyPair2.publicKey,
      );
      expect(verified.isValid).toBe(false);
    });
  });

  describe('demonstrate', () => {
    it('should show valid signature and detect tampering', () => {
      const result = service.demonstrate();
      expect(result.isValid).toBe(true);
      expect(result.isTamperedValid).toBe(false);
      expect(result.curve).toBe('P-256 (secp256r1)');
    });
  });
});
