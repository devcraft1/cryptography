import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/keypairs (GET)', () => {
    return request(app.getHttpServer()).get('/keypairs').expect(200);
  });

  // HMAC Tests
  describe('HMAC endpoints', () => {
    it('/hmac/demo (GET)', () => {
      return request(app.getHttpServer())
        .get('/hmac/demo')
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBeDefined();
          expect(res.body.key).toBeDefined();
          expect(res.body.hmac).toBeDefined();
          expect(res.body.isValid).toBe(true);
        });
    });

    it('/hmac/generate (POST)', () => {
      return request(app.getHttpServer())
        .post('/hmac/generate')
        .send({ message: 'test message', key: 'test key' })
        .expect(201)
        .expect((res) => {
          expect(res.body.hmac).toBeDefined();
          expect(res.body.message).toBe('test message');
        });
    });

    it('/hmac/verify (POST)', () => {
      const message = 'test message';
      const key = 'test key';

      return request(app.getHttpServer())
        .post('/hmac/generate')
        .send({ message, key })
        .expect(201)
        .then((response) => {
          const { hmac } = response.body;

          return request(app.getHttpServer())
            .post('/hmac/verify')
            .send({ message, key, expectedHmac: hmac })
            .expect(201)
            .expect((res) => {
              expect(res.body.isValid).toBe(true);
              expect(res.body.message).toBe(message);
            });
        });
    });
  });

  // Digital Signatures Tests
  describe('Digital Signatures endpoints', () => {
    it('/signatures/demo (GET)', () => {
      return request(app.getHttpServer())
        .get('/signatures/demo')
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBeDefined();
          expect(res.body.signature).toBeDefined();
          expect(res.body.isValid).toBe(true);
          expect(res.body.isTamperedValid).toBe(false);
          expect(res.body.publicKey).toBeDefined();
        });
    });

    it('/signatures/keypair (GET)', () => {
      return request(app.getHttpServer())
        .get('/signatures/keypair')
        .expect(200)
        .expect((res) => {
          expect(res.body.publicKey).toBeDefined();
          expect(res.body.privateKey).toBeDefined();
          expect(res.body.publicKey).toContain('BEGIN PUBLIC KEY');
          expect(res.body.privateKey).toContain('BEGIN PRIVATE KEY');
        });
    });

    it('/signatures/sign (POST)', () => {
      return request(app.getHttpServer())
        .post('/signatures/sign')
        .send({ message: 'test message to sign' })
        .expect(201)
        .expect((res) => {
          expect(res.body.signature).toBeDefined();
          expect(res.body.message).toBe('test message to sign');
        });
    });

    it('/signatures/verify (POST)', () => {
      const message = 'test message to verify';

      return request(app.getHttpServer())
        .post('/signatures/sign')
        .send({ message })
        .expect(201)
        .then((response) => {
          const { signature } = response.body;

          return request(app.getHttpServer())
            .post('/signatures/verify')
            .send({ message, signature })
            .expect(201)
            .expect((res) => {
              expect(res.body.isValid).toBe(true);
              expect(res.body.message).toBe(message);
            });
        });
    });
  });

  // Key Derivation Tests
  describe('Key Derivation endpoints', () => {
    it('/kdf/demo (GET)', () => {
      return request(app.getHttpServer())
        .get('/kdf/demo')
        .expect(200)
        .expect((res) => {
          expect(res.body.password).toBeDefined();
          expect(res.body.pbkdf2).toBeDefined();
          expect(res.body.scrypt).toBeDefined();
          expect(res.body.pbkdf2.isValid).toBe(true);
          expect(res.body.scrypt.isValid).toBe(true);
        });
    });

    it('/kdf/pbkdf2 (POST)', () => {
      return request(app.getHttpServer())
        .post('/kdf/pbkdf2')
        .send({ password: 'testPassword123' })
        .expect(201)
        .expect((res) => {
          expect(res.body.derivedKey).toBeDefined();
          expect(res.body.salt).toBeDefined();
          expect(res.body.iterations).toBe(100000);
          expect(res.body.keyLength).toBe(64);
        });
    });

    it('/kdf/scrypt (POST)', () => {
      return request(app.getHttpServer())
        .post('/kdf/scrypt')
        .send({ password: 'testPassword123' })
        .expect(201)
        .expect((res) => {
          expect(res.body.derivedKey).toBeDefined();
          expect(res.body.salt).toBeDefined();
          expect(res.body.keyLength).toBe(64);
          expect(res.body.options).toBeDefined();
        });
    });

    it('/kdf/verify (POST)', () => {
      const password = 'testPassword123';

      return request(app.getHttpServer())
        .post('/kdf/pbkdf2')
        .send({ password })
        .expect(201)
        .then((response) => {
          const { salt, derivedKey, iterations, keyLength, digest } = response.body;

          return request(app.getHttpServer())
            .post('/kdf/verify')
            .send({
              password,
              salt,
              storedKey: derivedKey,
              method: 'pbkdf2',
              options: { iterations, keyLength, digest }
            })
            .expect(201)
            .expect((res) => {
              expect(res.body.isValid).toBe(true);
            });
        });
    });
  });
});
