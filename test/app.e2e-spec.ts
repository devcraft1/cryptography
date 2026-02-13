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

  // Root & Health
  describe('Root endpoints', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Learn Cryptography API');
          expect(res.body.features).toHaveLength(26);
        });
    });

    it('/health (GET)', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ok');
        });
    });
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
          const { salt, derivedKey, iterations, keyLength, digest } =
            response.body;

          return request(app.getHttpServer())
            .post('/kdf/verify')
            .send({
              password,
              salt,
              storedKey: derivedKey,
              method: 'pbkdf2',
              options: { iterations, keyLength, digest },
            })
            .expect(201)
            .expect((res) => {
              expect(res.body.isValid).toBe(true);
            });
        });
    });
  });

  // Post-Quantum Cryptography — skipped in e2e (ESM dynamic imports unsupported in Jest VM)
  // PQC is fully covered by 19 unit tests in post-quantum.service.spec.ts

  // Encoding
  describe('Encoding endpoints', () => {
    it('/encoding/demo (GET)', () => {
      return request(app.getHttpServer())
        .get('/encoding/demo')
        .expect(200)
        .expect((res) => {
          expect(res.body.base64).toBeDefined();
          expect(res.body.hex).toBeDefined();
          expect(res.body.url).toBeDefined();
        });
    });

    it('/encoding/base64/encode + decode (POST)', () => {
      return request(app.getHttpServer())
        .post('/encoding/base64/encode')
        .send({ input: 'Hello, World!' })
        .expect(201)
        .then((res) => {
          expect(res.body.encoded).toBe('SGVsbG8sIFdvcmxkIQ==');
          return request(app.getHttpServer())
            .post('/encoding/base64/decode')
            .send({ encoded: res.body.encoded })
            .expect(201)
            .expect((decRes) => {
              expect(decRes.body.decoded).toBe('Hello, World!');
            });
        });
    });
  });

  // Secure Random
  describe('Random endpoints', () => {
    it('/random/demo (GET)', () => {
      return request(app.getHttpServer())
        .get('/random/demo')
        .expect(200)
        .expect((res) => {
          expect(res.body.bytes).toBeDefined();
          expect(res.body.uuid).toBeDefined();
          expect(res.body.integer).toBeDefined();
        });
    });

    it('/random/uuid (GET)', () => {
      return request(app.getHttpServer())
        .get('/random/uuid')
        .expect(200)
        .expect((res) => {
          expect(res.body.uuid).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
          );
        });
    });
  });

  // AES-GCM
  describe('AES-GCM endpoints', () => {
    it('/aes-gcm/demo (GET)', () => {
      return request(app.getHttpServer())
        .get('/aes-gcm/demo')
        .expect(200)
        .expect((res) => {
          expect(res.body.decrypted).toBe(res.body.original);
          expect(res.body.tamperDetected).toBe(true);
        });
    });

    it('/aes-gcm/encrypt + decrypt (POST)', () => {
      return request(app.getHttpServer())
        .post('/aes-gcm/encrypt')
        .send({ plaintext: 'e2e test message' })
        .expect(201)
        .then((encRes) => {
          return request(app.getHttpServer())
            .post('/aes-gcm/decrypt')
            .send({
              ciphertext: encRes.body.ciphertext,
              key: encRes.body.key,
              iv: encRes.body.iv,
              authTag: encRes.body.authTag,
            })
            .expect(201)
            .expect((decRes) => {
              expect(decRes.body.plaintext).toBe('e2e test message');
            });
        });
    });
  });

  // Diffie-Hellman
  describe('Diffie-Hellman endpoints', () => {
    it('/dh/demo (GET)', () => {
      return request(app.getHttpServer())
        .get('/dh/demo')
        .expect(200)
        .expect((res) => {
          expect(res.body.ecdh.secretsMatch).toBe(true);
        });
    });

    it('/dh/ecdh (POST)', () => {
      return request(app.getHttpServer())
        .post('/dh/ecdh')
        .send({ curve: 'secp256k1' })
        .expect(201)
        .expect((res) => {
          expect(res.body.secretsMatch).toBe(true);
          expect(res.body.algorithm).toBe('ECDH');
        });
    });
  });

  // ECC
  describe('ECC endpoints', () => {
    it('/ecc/demo (GET)', () => {
      return request(app.getHttpServer())
        .get('/ecc/demo')
        .expect(200)
        .expect((res) => {
          expect(res.body.isValid).toBe(true);
          expect(res.body.isTamperedValid).toBe(false);
        });
    });

    it('/ecc/sign + verify (POST)', () => {
      return request(app.getHttpServer())
        .post('/ecc/sign')
        .send({ message: 'e2e ecc test' })
        .expect(201)
        .then((signRes) => {
          expect(signRes.body.signature).toBeDefined();
          expect(signRes.body.publicKey).toBeDefined();

          return request(app.getHttpServer())
            .post('/ecc/verify')
            .send({
              message: 'e2e ecc test',
              signature: signRes.body.signature,
              publicKey: signRes.body.publicKey,
            })
            .expect(201)
            .expect((verifyRes) => {
              expect(verifyRes.body.isValid).toBe(true);
            });
        });
    });
  });

  // OTP
  describe('OTP endpoints', () => {
    it('/otp/demo (GET)', () => {
      return request(app.getHttpServer())
        .get('/otp/demo')
        .expect(200)
        .expect((res) => {
          expect(res.body.hotp.isValid).toBe(true);
          expect(res.body.totp.isValid).toBe(true);
        });
    });

    it('/otp/hotp/generate + verify (POST)', () => {
      return request(app.getHttpServer())
        .post('/otp/secret')
        .send({})
        .expect(201)
        .then((secretRes) => {
          return request(app.getHttpServer())
            .post('/otp/hotp/generate')
            .send({ secret: secretRes.body.secret, counter: 0 })
            .expect(201)
            .then((otpRes) => {
              return request(app.getHttpServer())
                .post('/otp/hotp/verify')
                .send({
                  otp: otpRes.body.otp,
                  secret: secretRes.body.secret,
                  counter: 0,
                })
                .expect(201)
                .expect((verifyRes) => {
                  expect(verifyRes.body.isValid).toBe(true);
                });
            });
        });
    });
  });

  // Certificates
  describe('Certificates endpoints', () => {
    it('/certificates/demo (GET)', () => {
      return request(app.getHttpServer())
        .get('/certificates/demo')
        .expect(200)
        .expect((res) => {
          expect(res.body.isValid).toBe(true);
          expect(res.body.isTamperedValid).toBe(false);
        });
    });
  });

  // Secret Sharing
  describe('Secret Sharing endpoints', () => {
    it('/secret-sharing/demo (GET)', () => {
      return request(app.getHttpServer())
        .get('/secret-sharing/demo')
        .expect(200)
        .expect((res) => {
          expect(res.body.reconstruction1.success).toBe(true);
          expect(res.body.reconstruction2.success).toBe(true);
        });
    });

    it('/secret-sharing/split + combine (POST)', () => {
      return request(app.getHttpServer())
        .post('/secret-sharing/split')
        .send({ secret: 'e2e test secret', totalShares: 5, threshold: 3 })
        .expect(201)
        .then((splitRes) => {
          const shares = splitRes.body.shares.slice(0, 3);
          return request(app.getHttpServer())
            .post('/secret-sharing/combine')
            .send({ shares })
            .expect(201)
            .expect((combineRes) => {
              expect(combineRes.body.secret).toBe('e2e test secret');
            });
        });
    });
  });

  // JWT
  describe('JWT endpoints', () => {
    it('/jwt/demo (GET)', () => {
      return request(app.getHttpServer())
        .get('/jwt/demo')
        .expect(200)
        .expect((res) => {
          expect(res.body.hs256.isValid).toBe(true);
          expect(res.body.rs256.isValid).toBe(true);
          expect(res.body.tamperedToken.isValid).toBe(false);
        });
    });

    it('/jwt/sign/hs256 + verify (POST)', () => {
      const payload = { sub: 'e2e-test', data: 'hello' };
      const secret = 'e2e-secret';

      return request(app.getHttpServer())
        .post('/jwt/sign/hs256')
        .send({ payload, secret })
        .expect(201)
        .then((signRes) => {
          return request(app.getHttpServer())
            .post('/jwt/verify')
            .send({
              token: signRes.body.token,
              secretOrPublicKey: secret,
              algorithm: 'HS256',
            })
            .expect(201)
            .expect((verifyRes) => {
              expect(verifyRes.body.isValid).toBe(true);
              expect(verifyRes.body.payload.sub).toBe('e2e-test');
            });
        });
    });
  });

  // ChaCha20-Poly1305
  describe('ChaCha20-Poly1305 endpoints', () => {
    it('/chacha20/demo (GET)', () => {
      return request(app.getHttpServer())
        .get('/chacha20/demo')
        .expect(200)
        .expect((res) => {
          expect(res.body.decrypted).toBe(res.body.original);
          expect(res.body.tamperDetected).toBe(true);
        });
    });

    it('/chacha20/encrypt + decrypt (POST)', () => {
      return request(app.getHttpServer())
        .post('/chacha20/encrypt')
        .send({ plaintext: 'e2e chacha20 test' })
        .expect(201)
        .then((encRes) => {
          return request(app.getHttpServer())
            .post('/chacha20/decrypt')
            .send({
              ciphertext: encRes.body.ciphertext,
              key: encRes.body.key,
              iv: encRes.body.iv,
              authTag: encRes.body.authTag,
            })
            .expect(201)
            .expect((decRes) => {
              expect(decRes.body.plaintext).toBe('e2e chacha20 test');
            });
        });
    });
  });

  // HKDF
  describe('HKDF endpoints', () => {
    it('/hkdf/demo (GET)', () => {
      return request(app.getHttpServer())
        .get('/hkdf/demo')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
        });
    });

    it('/hkdf/derive (POST)', () => {
      return request(app.getHttpServer())
        .post('/hkdf/derive')
        .send({ ikm: 'input-key-material' })
        .expect(201)
        .expect((res) => {
          expect(res.body.derivedKey).toBeDefined();
        });
    });
  });

  // Merkle Trees
  describe('Merkle Tree endpoints', () => {
    it('/merkle-tree/demo (GET)', () => {
      return request(app.getHttpServer())
        .get('/merkle-tree/demo')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
        });
    });

    it('/merkle-tree/build (POST)', () => {
      return request(app.getHttpServer())
        .post('/merkle-tree/build')
        .send({ leaves: ['a', 'b', 'c', 'd'] })
        .expect(201)
        .expect((res) => {
          expect(res.body.root).toBeDefined();
          expect(res.body.leafCount).toBe(4);
        });
    });
  });

  // Hybrid Encryption
  describe('Hybrid Encryption endpoints', () => {
    it('/hybrid/demo (GET)', () => {
      return request(app.getHttpServer())
        .get('/hybrid/demo')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
        });
    });

    it('/hybrid/keygen + encrypt + decrypt (POST)', () => {
      return request(app.getHttpServer())
        .get('/hybrid/keygen')
        .expect(200)
        .then((keyRes) => {
          return request(app.getHttpServer())
            .post('/hybrid/encrypt')
            .send({
              plaintext: 'e2e hybrid test',
              publicKey: keyRes.body.publicKey,
            })
            .expect(201)
            .then((encRes) => {
              return request(app.getHttpServer())
                .post('/hybrid/decrypt')
                .send({
                  encryptedKey: encRes.body.encryptedKey,
                  iv: encRes.body.iv,
                  authTag: encRes.body.authTag,
                  ciphertext: encRes.body.ciphertext,
                  privateKey: keyRes.body.privateKey,
                })
                .expect(201)
                .expect((decRes) => {
                  expect(decRes.body.plaintext).toBe('e2e hybrid test');
                });
            });
        });
    });
  });

  // Commitment Schemes
  describe('Commitment endpoints', () => {
    it('/commitment/demo (GET)', () => {
      return request(app.getHttpServer())
        .get('/commitment/demo')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
        });
    });

    it('/commitment/commit + verify (POST)', () => {
      return request(app.getHttpServer())
        .post('/commitment/commit')
        .send({ value: 'e2e-secret-value' })
        .expect(201)
        .then((commitRes) => {
          return request(app.getHttpServer())
            .post('/commitment/verify')
            .send({
              value: 'e2e-secret-value',
              nonce: commitRes.body.nonce,
              commitment: commitRes.body.commitment,
            })
            .expect(201)
            .expect((verifyRes) => {
              expect(verifyRes.body.isValid).toBe(true);
            });
        });
    });
  });

  // Zero-Knowledge Proofs
  describe('ZKP endpoints', () => {
    it('/zkp/demo (GET)', () => {
      return request(app.getHttpServer())
        .get('/zkp/demo')
        .expect(200)
        .expect((res) => {
          expect(res.body.validProof.isValid).toBe(true);
          expect(res.body.invalidProof.isValid).toBe(false);
        });
    });
  });

  // Key Wrapping
  describe('Key Wrapping endpoints', () => {
    it('/key-wrap/demo (GET)', () => {
      return request(app.getHttpServer())
        .get('/key-wrap/demo')
        .expect(200)
        .expect((res) => {
          expect(res.body.keysMatch).toBe(true);
          expect(res.body.wrongKekFails).toBe(true);
        });
    });

    it('/key-wrap/wrap + unwrap (POST)', () => {
      return request(app.getHttpServer())
        .get('/key-wrap/generate-data-key')
        .expect(200)
        .then((keyRes) => {
          return request(app.getHttpServer())
            .post('/key-wrap/wrap')
            .send({ keyToWrap: keyRes.body.dataKey })
            .expect(201)
            .then((wrapRes) => {
              return request(app.getHttpServer())
                .post('/key-wrap/unwrap')
                .send({
                  wrappedKey: wrapRes.body.wrappedKey,
                  kek: wrapRes.body.kek,
                  iv: wrapRes.body.iv,
                  authTag: wrapRes.body.authTag,
                })
                .expect(201)
                .expect((unwrapRes) => {
                  expect(unwrapRes.body.unwrappedKey).toBe(keyRes.body.dataKey);
                });
            });
        });
    });
  });

  // Blind Signatures
  describe('Blind Signatures endpoints', () => {
    it('/blind-signatures/demo (GET)', () => {
      return request(app.getHttpServer())
        .get('/blind-signatures/demo')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
        });
    });
  });

  // Envelope Encryption
  describe('Envelope Encryption endpoints', () => {
    it('/envelope/demo (GET)', () => {
      return request(app.getHttpServer())
        .get('/envelope/demo')
        .expect(200)
        .expect((res) => {
          expect(res.body.roundTripSuccess).toBe(true);
          expect(res.body.keyRotation.rotationSuccess).toBe(true);
        });
    });

    it('/envelope/encrypt + decrypt (POST)', () => {
      return request(app.getHttpServer())
        .post('/envelope/encrypt')
        .send({ plaintext: 'e2e envelope test' })
        .expect(201)
        .then((encRes) => {
          return request(app.getHttpServer())
            .post('/envelope/decrypt')
            .send({
              envelope: encRes.body.envelope,
              masterKey: encRes.body.masterKey,
            })
            .expect(201)
            .expect((decRes) => {
              expect(decRes.body.plaintext).toBe('e2e envelope test');
            });
        });
    });
  });
});
