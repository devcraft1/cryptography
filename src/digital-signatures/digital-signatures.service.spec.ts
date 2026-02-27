import { Test, TestingModule } from '@nestjs/testing';
import { DigitalSignaturesService } from './digital-signatures.service';

describe('DigitalSignaturesService', () => {
  let service: DigitalSignaturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DigitalSignaturesService],
    }).compile();

    service = module.get<DigitalSignaturesService>(DigitalSignaturesService);
    service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateFreshKeyPair', () => {
    it('should generate a valid RSA key pair', async () => {
      const keyPair = await service.generateFreshKeyPair();

      expect(keyPair).toBeDefined();
      expect(keyPair.publicKey).toBeDefined();
      expect(keyPair.privateKey).toBeDefined();
      expect(keyPair.publicKey).toContain('BEGIN PUBLIC KEY');
      expect(keyPair.privateKey).toContain('BEGIN PRIVATE KEY');
    });

    it('should generate different key pairs each time', async () => {
      const keyPair1 = await service.generateFreshKeyPair();
      const keyPair2 = await service.generateFreshKeyPair();

      expect(keyPair1.publicKey).not.toBe(keyPair2.publicKey);
      expect(keyPair1.privateKey).not.toBe(keyPair2.privateKey);
    });
  });

  describe('signMessage', () => {
    it('should sign a message', () => {
      const message = 'test message to sign';
      const signature = service.signMessage(message);

      expect(signature).toBeDefined();
      expect(typeof signature).toBe('string');
      expect(signature.length).toBeGreaterThan(0);
    });

    it('should generate different signatures for different messages', () => {
      const message1 = 'message 1';
      const message2 = 'message 2';

      const signature1 = service.signMessage(message1);
      const signature2 = service.signMessage(message2);

      expect(signature1).not.toBe(signature2);
    });

    it('should generate consistent signatures for same message', async () => {
      const message = 'test message';
      const keyPair = await service.generateFreshKeyPair();

      const signature1 = service.signMessage(message, keyPair.privateKey);
      const signature2 = service.signMessage(message, keyPair.privateKey);

      expect(signature1).toBe(signature2);
    });
  });

  describe('verifySignature', () => {
    it('should verify valid signature', async () => {
      const message = 'test message';
      const keyPair = await service.generateFreshKeyPair();

      const signature = service.signMessage(message, keyPair.privateKey);
      const isValid = service.verifySignature(
        message,
        signature,
        keyPair.publicKey,
      );

      expect(isValid).toBe(true);
    });

    it('should reject invalid signature', async () => {
      const message = 'test message';
      const keyPair = await service.generateFreshKeyPair();
      const invalidSignature = 'invalid-signature';

      const isValid = service.verifySignature(
        message,
        invalidSignature,
        keyPair.publicKey,
      );

      expect(isValid).toBe(false);
    });

    it('should reject signature with wrong public key', async () => {
      const message = 'test message';
      const keyPair1 = await service.generateFreshKeyPair();
      const keyPair2 = await service.generateFreshKeyPair();

      const signature = service.signMessage(message, keyPair1.privateKey);
      const isValid = service.verifySignature(
        message,
        signature,
        keyPair2.publicKey,
      );

      expect(isValid).toBe(false);
    });

    it('should reject signature with tampered message', async () => {
      const originalMessage = 'original message';
      const tamperedMessage = 'tampered message';
      const keyPair = await service.generateFreshKeyPair();

      const signature = service.signMessage(
        originalMessage,
        keyPair.privateKey,
      );
      const isValid = service.verifySignature(
        tamperedMessage,
        signature,
        keyPair.publicKey,
      );

      expect(isValid).toBe(false);
    });

    it('should work with service default key pair', () => {
      const message = 'test message with default keys';

      const signature = service.signMessage(message);
      const isValid = service.verifySignature(message, signature);

      expect(isValid).toBe(true);
    });
  });

  describe('demonstrateDigitalSignature', () => {
    it('should return demonstration with valid signature', () => {
      const demo = service.demonstrateDigitalSignature();

      expect(demo).toBeDefined();
      expect(demo.message).toBeDefined();
      expect(demo.signature).toBeDefined();
      expect(demo.isValid).toBe(true);
      expect(demo.publicKey).toBeDefined();
      expect(demo.demonstration).toContain(
        'Digital signatures provide authentication, integrity, and non-repudiation',
      );
    });

    it('should show tampering invalidates signature', () => {
      const demo = service.demonstrateDigitalSignature();

      expect(demo.tamperedMessage).toBeDefined();
      expect(demo.isTamperedValid).toBe(false);
      expect(demo.tamperedMessage).not.toBe(demo.message);
    });
  });

  describe('generateNonce', () => {
    it('should generate a nonce', () => {
      const nonce = service.generateNonce();

      expect(nonce).toBeDefined();
      expect(typeof nonce).toBe('string');
      expect(nonce.length).toBe(32); // 16 bytes * 2 (hex encoding)
    });

    it('should generate different nonces each time', () => {
      const nonce1 = service.generateNonce();
      const nonce2 = service.generateNonce();

      expect(nonce1).not.toBe(nonce2);
    });

    it('should generate nonce with specified length', () => {
      const length = 8;
      const nonce = service.generateNonce(length);

      expect(nonce.length).toBe(length * 2); // length * 2 (hex encoding)
    });
  });
});
