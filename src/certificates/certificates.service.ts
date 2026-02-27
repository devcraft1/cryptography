import { Injectable } from '@nestjs/common';
import {
  generateKeyPairSync,
  generateKeyPair,
  createSign,
  createVerify,
  randomBytes,
} from 'crypto';
import { promisify } from 'util';

const generateKeyPairAsync = promisify(generateKeyPair);

export interface Certificate {
  subject: string | { CN: string; O: string };
  issuer: string | { CN: string; O: string };
  publicKey: string;
  validFrom?: string;
  validTo?: string;
  serialNumber?: string;
  [key: string]: unknown;
}

@Injectable()
export class CertificatesService {
  private generateKeyPairSync() {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    return { publicKey, privateKey };
  }

  async generateFreshKeyPair() {
    const { publicKey, privateKey } = await generateKeyPairAsync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    return { publicKey, privateKey };
  }

  createSelfSigned(subject = 'localhost') {
    const { publicKey, privateKey } = this.generateKeyPairSync();
    const serialNumber = randomBytes(16).toString('hex');
    const now = new Date();
    const notAfter = new Date(now);
    notAfter.setFullYear(notAfter.getFullYear() + 1);

    const certificate = {
      version: 3,
      serialNumber,
      signatureAlgorithm: 'SHA256withRSA',
      issuer: { CN: subject, O: 'Self-Signed' },
      subject: { CN: subject, O: 'Self-Signed' },
      validity: {
        notBefore: now.toISOString(),
        notAfter: notAfter.toISOString(),
      },
      publicKey,
    };

    const signer = createSign('SHA256');
    signer.update(JSON.stringify(certificate));
    const signature = signer.sign(privateKey, 'hex');

    return { certificate, signature, privateKey };
  }

  verifyCertificate(certificate: Certificate, signature: string, publicKey: string) {
    const verifier = createVerify('SHA256');
    verifier.update(JSON.stringify(certificate));
    const isValid = verifier.verify(publicKey, signature, 'hex');
    return { isValid, certificate };
  }

  demonstrate() {
    const selfSigned = this.createSelfSigned('example.com');
    const verified = this.verifyCertificate(
      selfSigned.certificate,
      selfSigned.signature,
      selfSigned.certificate.publicKey,
    );

    const tampered = {
      ...selfSigned.certificate,
      subject: { CN: 'evil.com', O: 'Hacker' },
    };
    const tamperedVerified = this.verifyCertificate(
      tampered,
      selfSigned.signature,
      selfSigned.certificate.publicKey,
    );

    return {
      message:
        'X.509 Certificates: Digital identity documents for the internet',
      certificate: {
        ...selfSigned.certificate,
        publicKey: selfSigned.certificate.publicKey.substring(0, 60) + '...',
      },
      signature: selfSigned.signature.substring(0, 64) + '...',
      isValid: verified.isValid,
      tamperedSubject: tampered.subject,
      isTamperedValid: tamperedVerified.isValid,
      concepts: {
        selfSigned:
          'Certificate where issuer === subject (signed with own private key)',
        ca: 'Certificate Authority signs certificates with their private key',
        chainOfTrust:
          'Browser trusts Root CA -> Intermediate CA -> Server Certificate',
      },
    };
  }
}
