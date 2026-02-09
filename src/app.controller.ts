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
      ],
    };
  }

  @Get('health')
  getHealth() {
    return { status: 'ok' };
  }
}
