import { Test, TestingModule } from '@nestjs/testing';
import { CommitmentService } from './commitment.service';

describe('CommitmentService', () => {
  let service: CommitmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommitmentService],
    }).compile();
    service = module.get<CommitmentService>(CommitmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('commit', () => {
    it('should return commitment, nonce, and value', () => {
      const result = service.commit('test-secret');
      expect(result).toHaveProperty('commitment');
      expect(result).toHaveProperty('nonce');
      expect(result).toHaveProperty('value');
      expect(result.value).toBe('test-secret');
      expect(result.commitment).toMatch(/^[a-f0-9]{64}$/);
      expect(result.nonce).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should produce different commitments for the same value (different nonces)', () => {
      const result1 = service.commit('same-value');
      const result2 = service.commit('same-value');
      expect(result1.commitment).not.toBe(result2.commitment);
      expect(result1.nonce).not.toBe(result2.nonce);
    });
  });

  describe('verify', () => {
    it('should return isValid=true with correct value and nonce', () => {
      const { commitment, nonce, value } = service.commit('my-secret');
      const result = service.verify(value, nonce, commitment);
      expect(result.isValid).toBe(true);
      expect(result.value).toBe('my-secret');
      expect(result.commitment).toBe(commitment);
    });

    it('should return isValid=false with wrong value', () => {
      const { commitment, nonce } = service.commit('correct-value');
      const result = service.verify('wrong-value', nonce, commitment);
      expect(result.isValid).toBe(false);
    });

    it('should return isValid=false with wrong nonce', () => {
      const { commitment, value } = service.commit('my-secret');
      const result = service.verify(value, 'deadbeef'.repeat(8), commitment);
      expect(result.isValid).toBe(false);
    });
  });

  describe('demonstrate', () => {
    it('should return expected shape with coinFlip and sealedBidAuction', () => {
      const result = service.demonstrate();
      expect(result).toHaveProperty('coinFlip');
      expect(result).toHaveProperty('sealedBidAuction');
      expect(result).toHaveProperty('description');
      expect(result.coinFlip).toHaveProperty('steps');
      expect(result.coinFlip.steps.step4_verify.aliceValid).toBe(true);
      expect(result.coinFlip.steps.step4_verify.bobValid).toBe(true);
      expect(result.sealedBidAuction).toHaveProperty('steps');
      expect(result.sealedBidAuction.steps.step3_verify.bidder1Valid).toBe(
        true,
      );
      expect(result.sealedBidAuction.steps.step3_verify.bidder2Valid).toBe(
        true,
      );
      expect(result.sealedBidAuction.steps.step3_verify.bidder3Valid).toBe(
        true,
      );
      expect(result.sealedBidAuction.steps.step4_result.winner).toBe(
        'Bidder 2',
      );
      expect(result.sealedBidAuction.steps.step4_result.winningBid).toBe(275);
    });
  });
});
