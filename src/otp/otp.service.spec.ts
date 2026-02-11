import { Test, TestingModule } from '@nestjs/testing';
import { OtpService } from './otp.service';

describe('OtpService', () => {
  let service: OtpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OtpService],
    }).compile();
    service = module.get<OtpService>(OtpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateSecret', () => {
    it('should generate a hex secret and base32 encoding', () => {
      const result = service.generateSecret();
      expect(result.secret).toHaveLength(40);
      expect(result.base32).toBeDefined();
      expect(result.base32.length).toBeGreaterThan(0);
    });

    it('should generate unique secrets', () => {
      const a = service.generateSecret();
      const b = service.generateSecret();
      expect(a.secret).not.toBe(b.secret);
    });
  });

  describe('HOTP', () => {
    it('should generate a 6-digit OTP', () => {
      const secret = service.generateSecret().secret;
      const result = service.generateHotp(secret, 0);
      expect(result.otp).toMatch(/^\d{6}$/);
      expect(result.counter).toBe(0);
    });

    it('should produce same OTP for same secret and counter', () => {
      const secret = service.generateSecret().secret;
      const a = service.generateHotp(secret, 42);
      const b = service.generateHotp(secret, 42);
      expect(a.otp).toBe(b.otp);
    });

    it('should produce different OTPs for different counters', () => {
      const secret = service.generateSecret().secret;
      const a = service.generateHotp(secret, 0);
      const b = service.generateHotp(secret, 1);
      expect(a.otp).not.toBe(b.otp);
    });

    it('should verify correct HOTP', () => {
      const secret = service.generateSecret().secret;
      const { otp } = service.generateHotp(secret, 5);
      const result = service.verifyHotp(otp, secret, 5);
      expect(result.isValid).toBe(true);
    });

    it('should reject wrong HOTP', () => {
      const secret = service.generateSecret().secret;
      const result = service.verifyHotp('000000', secret, 5);
      expect(result.isValid).toBe(false);
    });
  });

  describe('TOTP', () => {
    it('should generate a 6-digit TOTP', () => {
      const secret = service.generateSecret().secret;
      const result = service.generateTotp(secret);
      expect(result.otp).toMatch(/^\d{6}$/);
      expect(result.timeStep).toBe(30);
      expect(result.remainingSeconds).toBeGreaterThan(0);
      expect(result.remainingSeconds).toBeLessThanOrEqual(30);
    });

    it('should verify current TOTP', () => {
      const secret = service.generateSecret().secret;
      const { otp } = service.generateTotp(secret);
      const result = service.verifyTotp(otp, secret);
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid TOTP', () => {
      const secret = service.generateSecret().secret;
      const result = service.verifyTotp('000000', secret, 30, 0);
      expect(result.isValid).toBe(false);
    });
  });

  describe('demonstrate', () => {
    it('should return OTP demo data', () => {
      const result = service.demonstrate();
      expect(result.secret).toBeDefined();
      expect(result.hotp.isValid).toBe(true);
      expect(result.totp.isValid).toBe(true);
    });
  });
});
