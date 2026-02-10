import { Test, TestingModule } from '@nestjs/testing';
import { PostQuantumService } from './post-quantum.service';

describe('PostQuantumService', () => {
  let service: PostQuantumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostQuantumService],
    }).compile();

    service = module.get<PostQuantumService>(PostQuantumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ── ML-KEM ──

  describe('kemKeygen', () => {
    it('should generate a keypair with default variant (768)', () => {
      const result = service.kemKeygen();

      expect(result.publicKey).toBeDefined();
      expect(result.secretKey).toBeDefined();
      expect(result.variant).toBe('ML-KEM-768');
      expect(typeof result.publicKey).toBe('string');
      expect(typeof result.secretKey).toBe('string');
      expect(result.publicKey.length).toBeGreaterThan(0);
      expect(result.secretKey.length).toBeGreaterThan(0);
    });

    it('should generate a keypair with variant 512', () => {
      const result = service.kemKeygen('512');
      expect(result.variant).toBe('ML-KEM-512');
      expect(result.publicKey).toBeDefined();
    });

    it('should generate a keypair with variant 1024', () => {
      const result = service.kemKeygen('1024');
      expect(result.variant).toBe('ML-KEM-1024');
      expect(result.publicKey).toBeDefined();
    });

    it('should generate different keypairs each time', () => {
      const result1 = service.kemKeygen();
      const result2 = service.kemKeygen();
      expect(result1.publicKey).not.toBe(result2.publicKey);
    });

    it('should throw for unknown variant', () => {
      expect(() => service.kemKeygen('999')).toThrow('Unknown ML-KEM variant');
    });
  });

  describe('kemEncapsulate + kemDecapsulate', () => {
    it('should produce matching shared secrets', () => {
      const keys = service.kemKeygen();
      const encResult = service.kemEncapsulate(keys.publicKey);
      const decResult = service.kemDecapsulate(
        encResult.cipherText,
        keys.secretKey,
      );

      expect(encResult.sharedSecret).toBeDefined();
      expect(decResult.sharedSecret).toBeDefined();
      expect(encResult.sharedSecret).toBe(decResult.sharedSecret);
    });

    it('should work with variant 512', () => {
      const keys = service.kemKeygen('512');
      const encResult = service.kemEncapsulate(keys.publicKey, '512');
      const decResult = service.kemDecapsulate(
        encResult.cipherText,
        keys.secretKey,
        '512',
      );
      expect(encResult.sharedSecret).toBe(decResult.sharedSecret);
    });

    it('should work with variant 1024', () => {
      const keys = service.kemKeygen('1024');
      const encResult = service.kemEncapsulate(keys.publicKey, '1024');
      const decResult = service.kemDecapsulate(
        encResult.cipherText,
        keys.secretKey,
        '1024',
      );
      expect(encResult.sharedSecret).toBe(decResult.sharedSecret);
    });

    it('should produce different ciphertexts for same public key', () => {
      const keys = service.kemKeygen();
      const enc1 = service.kemEncapsulate(keys.publicKey);
      const enc2 = service.kemEncapsulate(keys.publicKey);
      expect(enc1.cipherText).not.toBe(enc2.cipherText);
    });
  });

  describe('demonstrateKem', () => {
    it('should return a valid demonstration', () => {
      const demo = service.demonstrateKem();

      expect(demo.variant).toBe('ML-KEM-768');
      expect(demo.publicKey).toBeDefined();
      expect(demo.cipherText).toBeDefined();
      expect(demo.aliceSharedSecret).toBeDefined();
      expect(demo.bobSharedSecret).toBeDefined();
      expect(demo.secretsMatch).toBe(true);
      expect(demo.demonstration).toContain('quantum-resistant key exchange');
    });
  });

  // ── ML-DSA ──

  describe('dsaKeygen', () => {
    it('should generate a keypair with default variant (65)', () => {
      const result = service.dsaKeygen();

      expect(result.publicKey).toBeDefined();
      expect(result.secretKey).toBeDefined();
      expect(result.variant).toBe('ML-DSA-65');
      expect(result.publicKey.length).toBeGreaterThan(0);
    });

    it('should generate a keypair with variant 44', () => {
      const result = service.dsaKeygen('44');
      expect(result.variant).toBe('ML-DSA-44');
    });

    it('should generate a keypair with variant 87', () => {
      const result = service.dsaKeygen('87');
      expect(result.variant).toBe('ML-DSA-87');
    });

    it('should throw for unknown variant', () => {
      expect(() => service.dsaKeygen('99')).toThrow('Unknown ML-DSA variant');
    });
  });

  describe('dsaSign + dsaVerify', () => {
    it('should sign and verify a message', () => {
      const keys = service.dsaKeygen();
      const message = 'Hello post-quantum world';

      const signResult = service.dsaSign(message, keys.secretKey);
      const verifyResult = service.dsaVerify(
        signResult.signature,
        message,
        keys.publicKey,
      );

      expect(signResult.signature).toBeDefined();
      expect(signResult.message).toBe(message);
      expect(verifyResult.isValid).toBe(true);
    });

    it('should reject tampered message', () => {
      const keys = service.dsaKeygen();
      const signResult = service.dsaSign('original', keys.secretKey);

      const verifyResult = service.dsaVerify(
        signResult.signature,
        'tampered',
        keys.publicKey,
      );

      expect(verifyResult.isValid).toBe(false);
    });

    it('should reject wrong public key', () => {
      const keys1 = service.dsaKeygen();
      const keys2 = service.dsaKeygen();
      const signResult = service.dsaSign('message', keys1.secretKey);

      const verifyResult = service.dsaVerify(
        signResult.signature,
        'message',
        keys2.publicKey,
      );

      expect(verifyResult.isValid).toBe(false);
    });

    it('should work with variant 44', () => {
      const keys = service.dsaKeygen('44');
      const signResult = service.dsaSign('test', keys.secretKey, '44');
      const verifyResult = service.dsaVerify(
        signResult.signature,
        'test',
        keys.publicKey,
        '44',
      );
      expect(verifyResult.isValid).toBe(true);
    });
  });

  describe('demonstrateDsa', () => {
    it('should return a valid demonstration', () => {
      const demo = service.demonstrateDsa();

      expect(demo.variant).toBe('ML-DSA-65');
      expect(demo.message).toBeDefined();
      expect(demo.signature).toBeDefined();
      expect(demo.isValid).toBe(true);
      expect(demo.isTamperedValid).toBe(false);
      expect(demo.publicKey).toBeDefined();
      expect(demo.demonstration).toContain('quantum-resistant digital signatures');
    });
  });

  // ── SLH-DSA ──

  describe('slhKeygen', () => {
    it('should generate a keypair with default variant (128f)', () => {
      const result = service.slhKeygen();

      expect(result.publicKey).toBeDefined();
      expect(result.secretKey).toBeDefined();
      expect(result.variant).toBe('SLH-DSA-SHAKE-128f');
      expect(result.publicKey.length).toBeGreaterThan(0);
    });

    it('should throw for unknown variant', () => {
      expect(() => service.slhKeygen('999')).toThrow(
        'Unknown SLH-DSA variant',
      );
    });
  });

  describe('slhSign + slhVerify', () => {
    it('should sign and verify a message', () => {
      const keys = service.slhKeygen();
      const message = 'Hello hash-based signatures';

      const signResult = service.slhSign(message, keys.secretKey);
      const verifyResult = service.slhVerify(
        signResult.signature,
        message,
        keys.publicKey,
      );

      expect(signResult.signature).toBeDefined();
      expect(signResult.message).toBe(message);
      expect(verifyResult.isValid).toBe(true);
    });

    it('should reject tampered message', () => {
      const keys = service.slhKeygen();
      const signResult = service.slhSign('original', keys.secretKey);

      const verifyResult = service.slhVerify(
        signResult.signature,
        'tampered',
        keys.publicKey,
      );

      expect(verifyResult.isValid).toBe(false);
    });

    it('should reject wrong public key', () => {
      const keys1 = service.slhKeygen();
      const keys2 = service.slhKeygen();
      const signResult = service.slhSign('message', keys1.secretKey);

      const verifyResult = service.slhVerify(
        signResult.signature,
        'message',
        keys2.publicKey,
      );

      expect(verifyResult.isValid).toBe(false);
    });
  });

  describe('demonstrateSlh', () => {
    it('should return a valid demonstration', () => {
      const demo = service.demonstrateSlh();

      expect(demo.variant).toBe('SLH-DSA-SHAKE-128f');
      expect(demo.message).toBeDefined();
      expect(demo.signature).toBeDefined();
      expect(demo.isValid).toBe(true);
      expect(demo.isTamperedValid).toBe(false);
      expect(demo.publicKey).toBeDefined();
      expect(demo.demonstration).toContain('hash-based quantum-resistant signatures');
    });
  });
});
