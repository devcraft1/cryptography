import { Test, TestingModule } from '@nestjs/testing';
import { ZkpService } from './zkp.service';

describe('ZkpService', () => {
  let service: ZkpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZkpService],
    }).compile();
    service = module.get<ZkpService>(ZkpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generatePublicValue', () => {
    it('should return a hex string public value', () => {
      const result = service.generatePublicValue('test-secret');
      expect(result.publicValue).toBeDefined();
      expect(typeof result.publicValue).toBe('string');
      expect(result.publicValue).toMatch(/^[0-9a-f]+$/);
      expect(result.secret).toBe('test-secret');
    });

    it('should produce consistent public values for the same secret', () => {
      const result1 = service.generatePublicValue('same-secret');
      const result2 = service.generatePublicValue('same-secret');
      expect(result1.publicValue).toBe(result2.publicValue);
    });

    it('should produce different public values for different secrets', () => {
      const result1 = service.generatePublicValue('secret-a');
      const result2 = service.generatePublicValue('secret-b');
      expect(result1.publicValue).not.toBe(result2.publicValue);
    });
  });

  describe('full protocol round-trip', () => {
    it('should verify successfully with correct proof', () => {
      const secret = 'my-secret';

      const { publicValue } = service.generatePublicValue(secret);
      const { commitment, k } = service.createCommitment(secret);
      const { challenge } = service.createChallenge();
      const { response } = service.createResponse(secret, k, challenge);
      const result = service.verify(publicValue, commitment, challenge, response);

      expect(result.isValid).toBe(true);
      expect(result.explanation).toContain('VALID');
    });

    it('should work with different secrets', () => {
      const secrets = ['password123', 'a', 'very-long-secret-value-with-special-chars!@#$'];

      for (const secret of secrets) {
        const { publicValue } = service.generatePublicValue(secret);
        const { commitment, k } = service.createCommitment(secret);
        const { challenge } = service.createChallenge();
        const { response } = service.createResponse(secret, k, challenge);
        const result = service.verify(publicValue, commitment, challenge, response);

        expect(result.isValid).toBe(true);
      }
    });
  });

  describe('failed verification', () => {
    it('should fail with wrong response', () => {
      const secret = 'my-secret';

      const { publicValue } = service.generatePublicValue(secret);
      const { commitment } = service.createCommitment(secret);
      const { challenge } = service.createChallenge();

      // Use a completely wrong response
      const wrongResponse = 'deadbeef0123456789abcdef';
      const result = service.verify(publicValue, commitment, challenge, wrongResponse);

      expect(result.isValid).toBe(false);
      expect(result.explanation).toContain('INVALID');
    });

    it('should fail with wrong public value', () => {
      const secret = 'my-secret';
      const wrongSecret = 'wrong-secret';

      const { publicValue: wrongPublicValue } =
        service.generatePublicValue(wrongSecret);
      const { commitment, k } = service.createCommitment(secret);
      const { challenge } = service.createChallenge();
      const { response } = service.createResponse(secret, k, challenge);

      const result = service.verify(
        wrongPublicValue,
        commitment,
        challenge,
        response,
      );

      expect(result.isValid).toBe(false);
      expect(result.explanation).toContain('INVALID');
    });
  });

  describe('createChallenge', () => {
    it('should return a hex string challenge', () => {
      const result = service.createChallenge();
      expect(result.challenge).toBeDefined();
      expect(typeof result.challenge).toBe('string');
      expect(result.challenge).toMatch(/^[0-9a-f]+$/);
    });

    it('should generate different challenges each time', () => {
      const c1 = service.createChallenge();
      const c2 = service.createChallenge();
      expect(c1.challenge).not.toBe(c2.challenge);
    });
  });

  describe('demonstrate', () => {
    it('should return expected shape with valid proof', () => {
      const result = service.demonstrate();

      expect(result.protocol).toBe('Schnorr Zero-Knowledge Proof');
      expect(result.description).toBeDefined();
      expect(result.steps).toBeDefined();
      expect(result.steps.step1_publicValue).toBeDefined();
      expect(result.steps.step2_commitment).toBeDefined();
      expect(result.steps.step3_challenge).toBeDefined();
      expect(result.steps.step4_response).toBeDefined();
      expect(result.steps.step5_verification).toBeDefined();
      expect(result.validProof.isValid).toBe(true);
      expect(result.invalidProof.isValid).toBe(false);
      expect(result.keyInsight).toBeDefined();
    });
  });
});
