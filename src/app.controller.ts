import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('App')
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
        {
          name: "Shamir's Secret Sharing",
          prefix: '/secret-sharing',
          endpoints: 3,
        },
        { name: 'JSON Web Tokens', prefix: '/jwt', endpoints: 5 },
        { name: 'Hybrid Encryption', prefix: '/hybrid', endpoints: 4 },
        { name: 'HKDF', prefix: '/hkdf', endpoints: 3 },
        { name: 'Merkle Trees', prefix: '/merkle-tree', endpoints: 4 },
        { name: 'Commitment Schemes', prefix: '/commitment', endpoints: 3 },
        { name: 'Zero-Knowledge Proofs', prefix: '/zkp', endpoints: 5 },
        { name: 'Key Wrapping', prefix: '/key-wrap', endpoints: 5 },
        { name: 'Blind Signatures', prefix: '/blind-signatures', endpoints: 6 },
        { name: 'Envelope Encryption', prefix: '/envelope', endpoints: 5 },
        { name: 'ChaCha20-Poly1305', prefix: '/chacha20', endpoints: 3 },
      ],
    };
  }

  @Get('health')
  getHealth() {
    const memoryUsage = process.memoryUsage();
    return {
      status: 'ok',
      uptime: process.uptime(),
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      },
    };
  }
}
