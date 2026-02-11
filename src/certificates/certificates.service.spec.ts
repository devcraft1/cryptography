import { Test, TestingModule } from '@nestjs/testing';
import { CertificatesService } from './certificates.service';

describe('CertificatesService', () => {
  let service: CertificatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CertificatesService],
    }).compile();
    service = module.get<CertificatesService>(CertificatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateKeyPair', () => {
    it('should generate RSA key pair', () => {
      const result = service.generateKeyPair();
      expect(result.publicKey).toContain('BEGIN PUBLIC KEY');
      expect(result.privateKey).toContain('BEGIN PRIVATE KEY');
    });
  });

  describe('createSelfSigned', () => {
    it('should create a self-signed certificate', () => {
      const result = service.createSelfSigned('test.example.com');
      expect(result.certificate.subject.CN).toBe('test.example.com');
      expect(result.certificate.issuer.CN).toBe('test.example.com');
      expect(result.certificate.version).toBe(3);
      expect(result.signature).toBeDefined();
      expect(result.privateKey).toBeDefined();
    });

    it('should default subject to localhost', () => {
      const result = service.createSelfSigned();
      expect(result.certificate.subject.CN).toBe('localhost');
    });
  });

  describe('verifyCertificate', () => {
    it('should verify a valid certificate', () => {
      const created = service.createSelfSigned();
      const result = service.verifyCertificate(
        created.certificate,
        created.signature,
        created.certificate.publicKey,
      );
      expect(result.isValid).toBe(true);
    });

    it('should reject a tampered certificate', () => {
      const created = service.createSelfSigned();
      const tampered = {
        ...created.certificate,
        subject: { CN: 'evil.com', O: 'Hacker' },
      };
      const result = service.verifyCertificate(
        tampered,
        created.signature,
        created.certificate.publicKey,
      );
      expect(result.isValid).toBe(false);
    });
  });

  describe('demonstrate', () => {
    it('should demonstrate certificate creation and verification', () => {
      const result = service.demonstrate();
      expect(result.isValid).toBe(true);
      expect(result.isTamperedValid).toBe(false);
      expect(result.concepts).toBeDefined();
    });
  });
});
