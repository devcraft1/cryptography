import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getInfo() {
    return {
      name: 'Learn Cryptography API',
      version: '1.0.0',
      description:
        'An educational API for learning cryptography concepts through practical examples.',
      features: [
        { name: 'Hashing', prefix: '/hash', endpoints: 3 },
        { name: 'Key Pairs', prefix: '/keypairs', endpoints: 4 },
        { name: 'Encryption', prefix: '/encryption', endpoints: 2 },
        { name: 'Salts', prefix: '/salts', endpoints: 2 },
        { name: 'HMAC', prefix: '/hmac', endpoints: 3 },
        { name: 'Digital Signatures', prefix: '/signatures', endpoints: 4 },
        { name: 'Key Derivation', prefix: '/kdf', endpoints: 4 },
        { name: 'Post-Quantum Cryptography', prefix: '/pqc', endpoints: 12 },
        { name: 'Encoding', prefix: '/encoding', endpoints: 7 },
        { name: 'Secure Random', prefix: '/random', endpoints: 4 },
        { name: 'AES-GCM', prefix: '/aes-gcm', endpoints: 3 },
        { name: 'Diffie-Hellman', prefix: '/dh', endpoints: 3 },
        { name: 'Elliptic Curve Cryptography', prefix: '/ecc', endpoints: 4 },
        { name: 'One-Time Passwords', prefix: '/otp', endpoints: 6 },
        { name: 'X.509 Certificates', prefix: '/certificates', endpoints: 3 },
        { name: "Shamir's Secret Sharing", prefix: '/secret-sharing', endpoints: 3 },
        { name: 'JSON Web Tokens', prefix: '/jwt', endpoints: 5 },
      ],
    };
  }

  @Get('health')
  getHealth() {
    return { status: 'ok' };
  }
}
