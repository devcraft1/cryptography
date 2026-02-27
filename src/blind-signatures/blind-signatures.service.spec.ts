import { Test, TestingModule } from '@nestjs/testing';
import { BlindSignaturesService } from './blind-signatures.service';

describe('BlindSignaturesService', () => {
  let service: BlindSignaturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlindSignaturesService],
    }).compile();

    service = module.get<BlindSignaturesService>(BlindSignaturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateKeys', () => {
    it('should return valid hex strings for n, e, and d', () => {
      const keys = service.generateKeys();

      expect(keys).toBeDefined();
      expect(keys.publicKeyN).toBeDefined();
      expect(keys.publicKeyE).toBeDefined();
      expect(keys.privateKeyD).toBeDefined();

      // All should be valid hex strings
      expect(keys.publicKeyN).toMatch(/^[0-9a-f]+$/);
      expect(keys.publicKeyE).toMatch(/^[0-9a-f]+$/);
      expect(keys.privateKeyD).toMatch(/^[0-9a-f]+$/);

      // n should be a large number (512-bit = ~128 hex chars)
      expect(keys.publicKeyN.length).toBeGreaterThanOrEqual(100);

      // e is typically 65537 = 0x010001
      expect(keys.publicKeyE).toBe('010001');
    });

    it('should generate different keys each time', () => {
      const keys1 = service.generateKeys();
      const keys2 = service.generateKeys();

      expect(keys1.publicKeyN).not.toBe(keys2.publicKeyN);
      expect(keys1.privateKeyD).not.toBe(keys2.privateKeyD);
    });
  });

  describe('generateFreshKeys', () => {
    it('should return valid hex strings for n, e, and d', async () => {
      const keys = await service.generateFreshKeys();

      expect(keys).toBeDefined();
      expect(keys.publicKeyN).toMatch(/^[0-9a-f]+$/);
      expect(keys.publicKeyE).toBe('010001');
      expect(keys.privateKeyD).toMatch(/^[0-9a-f]+$/);
    });

    it('should generate different keys each time', async () => {
      const keys1 = await service.generateFreshKeys();
      const keys2 = await service.generateFreshKeys();

      expect(keys1.publicKeyN).not.toBe(keys2.publicKeyN);
      expect(keys1.privateKeyD).not.toBe(keys2.privateKeyD);
    });
  });

  describe('full protocol round-trip', () => {
    it('should complete keygen -> blind -> sign -> unblind -> verify with isValid=true', () => {
      // Step 1: Generate keys
      const keys = service.generateKeys();

      // Step 2: Blind the message
      const message = 'Hello, blind signatures!';
      const blindResult = service.blind(
        message,
        keys.publicKeyN,
        keys.publicKeyE,
      );

      expect(blindResult.blindedMessage).toMatch(/^[0-9a-f]+$/);
      expect(blindResult.blindingFactor).toMatch(/^[0-9a-f]+$/);
      expect(blindResult.messageHash).toMatch(/^[0-9a-f]+$/);

      // Step 3: Signer signs the blinded message
      const signResult = service.signBlinded(
        blindResult.blindedMessage,
        keys.privateKeyD,
        keys.publicKeyN,
      );

      expect(signResult.blindedSignature).toMatch(/^[0-9a-f]+$/);

      // Step 4: Requester unblinds the signature
      const unblindResult = service.unblind(
        signResult.blindedSignature,
        blindResult.blindingFactor,
        keys.publicKeyN,
      );

      expect(unblindResult.signature).toMatch(/^[0-9a-f]+$/);

      // Step 5: Verify the signature
      const verifyResult = service.verify(
        message,
        unblindResult.signature,
        keys.publicKeyN,
        keys.publicKeyE,
      );

      expect(verifyResult.isValid).toBe(true);
      expect(verifyResult.message).toBe(message);
    });
  });

  describe('verify with wrong message', () => {
    it('should return isValid=false', () => {
      const keys = service.generateKeys();
      const message = 'Original message';

      const blindResult = service.blind(
        message,
        keys.publicKeyN,
        keys.publicKeyE,
      );
      const signResult = service.signBlinded(
        blindResult.blindedMessage,
        keys.privateKeyD,
        keys.publicKeyN,
      );
      const unblindResult = service.unblind(
        signResult.blindedSignature,
        blindResult.blindingFactor,
        keys.publicKeyN,
      );

      const verifyResult = service.verify(
        'Wrong message',
        unblindResult.signature,
        keys.publicKeyN,
        keys.publicKeyE,
      );

      expect(verifyResult.isValid).toBe(false);
    });
  });

  describe('verify with wrong signature', () => {
    it('should return isValid=false', () => {
      const keys = service.generateKeys();
      const message = 'Test message';

      // Use a fabricated signature (just some random hex)
      const fakeSignature = 'abcdef0123456789abcdef0123456789';

      const verifyResult = service.verify(
        message,
        fakeSignature,
        keys.publicKeyN,
        keys.publicKeyE,
      );

      expect(verifyResult.isValid).toBe(false);
    });
  });

  describe('demonstrate', () => {
    it('should return expected shape with isValid=true', () => {
      const demo = service.demonstrate();

      expect(demo).toBeDefined();
      expect(demo.description).toContain('RSA Blind Signature');

      // Protocol steps
      expect(demo.protocol).toBeDefined();
      expect(demo.protocol.step1_keyGeneration).toBeDefined();
      expect(demo.protocol.step1_keyGeneration.publicKeyN).toBeDefined();
      expect(demo.protocol.step1_keyGeneration.publicKeyE).toBeDefined();
      expect(demo.protocol.step1_keyGeneration.privateKeyD).toBeDefined();

      expect(demo.protocol.step2_blinding).toBeDefined();
      expect(demo.protocol.step2_blinding.originalMessage).toBeDefined();
      expect(demo.protocol.step2_blinding.messageHash).toBeDefined();
      expect(demo.protocol.step2_blinding.blindingFactor).toBeDefined();
      expect(demo.protocol.step2_blinding.blindedMessage).toBeDefined();

      expect(demo.protocol.step3_signing).toBeDefined();
      expect(demo.protocol.step3_signing.blindedSignature).toBeDefined();

      expect(demo.protocol.step4_unblinding).toBeDefined();
      expect(demo.protocol.step4_unblinding.finalSignature).toBeDefined();

      expect(demo.protocol.step5_verification).toBeDefined();
      expect(demo.protocol.step5_verification.isValid).toBe(true);

      // Tampered message should fail
      expect(demo.tamperedMessageVerification).toBeDefined();
      expect(demo.tamperedMessageVerification.isValid).toBe(false);
    });
  });
});
