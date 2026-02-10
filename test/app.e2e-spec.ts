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

  // Post-Quantum Cryptography — ML-KEM
  describe('PQC ML-KEM endpoints', () => {
    it('/pqc/kem/demo (GET)', () => {
      return request(app.getHttpServer())
        .get('/pqc/kem/demo')
        .expect(200)
        .expect((res) => {
          expect(res.body.variant).toBe('ML-KEM-768');
          expect(res.body.publicKey).toBeDefined();
          expect(res.body.cipherText).toBeDefined();
          expect(res.body.aliceSharedSecret).toBeDefined();
          expect(res.body.bobSharedSecret).toBeDefined();
          expect(res.body.secretsMatch).toBe(true);
        });
    });

    it('/pqc/kem/keygen (POST)', () => {
      return request(app.getHttpServer())
        .post('/pqc/kem/keygen')
        .send({})
        .expect(201)
        .expect((res) => {
          expect(res.body.publicKey).toBeDefined();
          expect(res.body.secretKey).toBeDefined();
          expect(res.body.variant).toBe('ML-KEM-768');
          expect(typeof res.body.publicKey).toBe('string');
          expect(typeof res.body.secretKey).toBe('string');
        });
    });

    it('/pqc/kem/encapsulate + /pqc/kem/decapsulate (POST)', () => {
      return request(app.getHttpServer())
        .post('/pqc/kem/keygen')
        .send({})
        .expect(201)
        .then((keyRes) => {
          return request(app.getHttpServer())
            .post('/pqc/kem/encapsulate')
            .send({ publicKey: keyRes.body.publicKey })
            .expect(201)
            .then((encRes) => {
              expect(encRes.body.cipherText).toBeDefined();
              expect(encRes.body.sharedSecret).toBeDefined();

              return request(app.getHttpServer())
                .post('/pqc/kem/decapsulate')
                .send({
                  cipherText: encRes.body.cipherText,
                  secretKey: keyRes.body.secretKey,
                })
                .expect(201)
                .expect((decRes) => {
                  expect(decRes.body.sharedSecret).toBe(
                    encRes.body.sharedSecret,
                  );
                });
            });
        });
    });
  });

  // Post-Quantum Cryptography — ML-DSA
  describe('PQC ML-DSA endpoints', () => {
    it('/pqc/dsa/demo (GET)', () => {
      return request(app.getHttpServer())
        .get('/pqc/dsa/demo')
        .expect(200)
        .expect((res) => {
          expect(res.body.variant).toBe('ML-DSA-65');
          expect(res.body.message).toBeDefined();
          expect(res.body.signature).toBeDefined();
          expect(res.body.isValid).toBe(true);
          expect(res.body.isTamperedValid).toBe(false);
          expect(res.body.publicKey).toBeDefined();
        });
    });

    it('/pqc/dsa/keygen (POST)', () => {
      return request(app.getHttpServer())
        .post('/pqc/dsa/keygen')
        .send({})
        .expect(201)
        .expect((res) => {
          expect(res.body.publicKey).toBeDefined();
          expect(res.body.secretKey).toBeDefined();
          expect(res.body.variant).toBe('ML-DSA-65');
        });
    });

    it('/pqc/dsa/sign + /pqc/dsa/verify (POST)', () => {
      const message = 'e2e test message for ML-DSA';

      return request(app.getHttpServer())
        .post('/pqc/dsa/keygen')
        .send({})
        .expect(201)
        .then((keyRes) => {
          return request(app.getHttpServer())
            .post('/pqc/dsa/sign')
            .send({ message, secretKey: keyRes.body.secretKey })
            .expect(201)
            .then((signRes) => {
              expect(signRes.body.signature).toBeDefined();
              expect(signRes.body.message).toBe(message);

              return request(app.getHttpServer())
                .post('/pqc/dsa/verify')
                .send({
                  message,
                  signature: signRes.body.signature,
                  publicKey: keyRes.body.publicKey,
                })
                .expect(201)
                .expect((verifyRes) => {
                  expect(verifyRes.body.isValid).toBe(true);
                  expect(verifyRes.body.message).toBe(message);
                });
            });
        });
    });
  });

  // Post-Quantum Cryptography — SLH-DSA
  describe('PQC SLH-DSA endpoints', () => {
    it('/pqc/slh/demo (GET)', () => {
      return request(app.getHttpServer())
        .get('/pqc/slh/demo')
        .expect(200)
        .expect((res) => {
          expect(res.body.variant).toBe('SLH-DSA-SHAKE-128f');
          expect(res.body.message).toBeDefined();
          expect(res.body.signature).toBeDefined();
          expect(res.body.isValid).toBe(true);
          expect(res.body.isTamperedValid).toBe(false);
          expect(res.body.publicKey).toBeDefined();
        });
    });

    it('/pqc/slh/keygen (POST)', () => {
      return request(app.getHttpServer())
        .post('/pqc/slh/keygen')
        .send({})
        .expect(201)
        .expect((res) => {
          expect(res.body.publicKey).toBeDefined();
          expect(res.body.secretKey).toBeDefined();
          expect(res.body.variant).toBe('SLH-DSA-SHAKE-128f');
        });
    });

    it('/pqc/slh/sign + /pqc/slh/verify (POST)', () => {
      const message = 'e2e test message for SLH-DSA';

      return request(app.getHttpServer())
        .post('/pqc/slh/keygen')
        .send({})
        .expect(201)
        .then((keyRes) => {
          return request(app.getHttpServer())
            .post('/pqc/slh/sign')
            .send({ message, secretKey: keyRes.body.secretKey })
            .expect(201)
            .then((signRes) => {
              expect(signRes.body.signature).toBeDefined();
              expect(signRes.body.message).toBe(message);

              return request(app.getHttpServer())
                .post('/pqc/slh/verify')
                .send({
                  message,
                  signature: signRes.body.signature,
                  publicKey: keyRes.body.publicKey,
                })
                .expect(201)
                .expect((verifyRes) => {
                  expect(verifyRes.body.isValid).toBe(true);
                  expect(verifyRes.body.message).toBe(message);
                });
            });
        });
    });
  });
});
