import { Test, TestingModule } from '@nestjs/testing';
import { KeyDerivationService } from './key-derivation.service';

describe('KeyDerivationService', () => {
  let service: KeyDerivationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeyDerivationService],
    }).compile();

    service = module.get<KeyDerivationService>(KeyDerivationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('pbkdf2', () => {
    it('should derive key using PBKDF2', () => {
      const password = 'testPassword123';
      const result = service.pbkdf2(password);

      expect(result).toBeDefined();
      expect(result.derivedKey).toBeDefined();
      expect(result.salt).toBeDefined();
      expect(result.iterations).toBe(100000);
      expect(result.keyLength).toBe(64);
      expect(result.digest).toBe('sha512');
      expect(typeof result.derivedKey).toBe('string');
      expect(result.derivedKey.length).toBe(128); // 64 bytes * 2 (hex)
    });

    it('should generate different keys for different passwords', () => {
      const password1 = 'password1';
      const password2 = 'password2';
      const salt = 'samesalt';

      const result1 = service.pbkdf2(password1, salt);
      const result2 = service.pbkdf2(password2, salt);

      expect(result1.derivedKey).not.toBe(result2.derivedKey);
    });

    it('should generate different keys for different salts', () => {
      const password = 'samepassword';
      const salt1 = 'salt1';
      const salt2 = 'salt2';

      const result1 = service.pbkdf2(password, salt1);
      const result2 = service.pbkdf2(password, salt2);

      expect(result1.derivedKey).not.toBe(result2.derivedKey);
    });

    it('should generate consistent keys for same inputs', () => {
      const password = 'testpassword';
      const salt = 'testsalt';

      const result1 = service.pbkdf2(password, salt);
      const result2 = service.pbkdf2(password, salt);

      expect(result1.derivedKey).toBe(result2.derivedKey);
    });

    it('should use custom parameters', () => {
      const password = 'testpassword';
      const salt = 'testsalt';
      const iterations = 50000;
      const keyLength = 32;
      const digest = 'sha256';

      const result = service.pbkdf2(
        password,
        salt,
        iterations,
        keyLength,
        digest,
      );

      expect(result.iterations).toBe(iterations);
      expect(result.keyLength).toBe(keyLength);
      expect(result.digest).toBe(digest);
      expect(result.derivedKey.length).toBe(keyLength * 2); // hex encoding
    });
  });

  describe('scrypt', () => {
    it('should derive key using scrypt', () => {
      const password = 'testPassword123';
      const result = service.scrypt(password);

      expect(result).toBeDefined();
      expect(result.derivedKey).toBeDefined();
      expect(result.salt).toBeDefined();
      expect(result.keyLength).toBe(64);
      expect(result.options.N).toBe(16384);
      expect(result.options.r).toBe(8);
      expect(result.options.p).toBe(1);
      expect(typeof result.derivedKey).toBe('string');
      expect(result.derivedKey.length).toBe(128); // 64 bytes * 2 (hex)
    });

    it('should generate different keys for different passwords', () => {
      const password1 = 'password1';
      const password2 = 'password2';
      const salt = 'samesalt';

      const result1 = service.scrypt(password1, salt);
      const result2 = service.scrypt(password2, salt);

      expect(result1.derivedKey).not.toBe(result2.derivedKey);
    });

    it('should generate different keys for different salts', () => {
      const password = 'samepassword';
      const salt1 = 'salt1';
      const salt2 = 'salt2';

      const result1 = service.scrypt(password, salt1);
      const result2 = service.scrypt(password, salt2);

      expect(result1.derivedKey).not.toBe(result2.derivedKey);
    });

    it('should generate consistent keys for same inputs', () => {
      const password = 'testpassword';
      const salt = 'testsalt';

      const result1 = service.scrypt(password, salt);
      const result2 = service.scrypt(password, salt);

      expect(result1.derivedKey).toBe(result2.derivedKey);
    });

    it('should use custom parameters', () => {
      const password = 'testpassword';
      const salt = 'testsalt';
      const keyLength = 32;
      const options = { N: 8192, r: 16, p: 2 };

      const result = service.scrypt(password, salt, keyLength, options);

      expect(result.keyLength).toBe(keyLength);
      expect(result.options).toEqual(options);
      expect(result.derivedKey.length).toBe(keyLength * 2); // hex encoding
    });
  });

  describe('verifyPassword', () => {
    it('should verify PBKDF2 password correctly', () => {
      const password = 'testPassword123';
      const result = service.pbkdf2(password);

      const isValid = service.verifyPassword(
        password,
        result.salt,
        result.derivedKey,
        'pbkdf2',
        {
          iterations: result.iterations,
          keyLength: result.keyLength,
          digest: result.digest,
        },
      );

      expect(isValid).toBe(true);
    });

    it('should reject wrong PBKDF2 password', () => {
      const correctPassword = 'correctPassword';
      const wrongPassword = 'wrongPassword';
      const result = service.pbkdf2(correctPassword);

      const isValid = service.verifyPassword(
        wrongPassword,
        result.salt,
        result.derivedKey,
        'pbkdf2',
        {
          iterations: result.iterations,
          keyLength: result.keyLength,
          digest: result.digest,
        },
      );

      expect(isValid).toBe(false);
    });

    it('should verify scrypt password correctly', () => {
      const password = 'testPassword123';
      const result = service.scrypt(password);

      const isValid = service.verifyPassword(
        password,
        result.salt,
        result.derivedKey,
        'scrypt',
        { keyLength: result.keyLength },
      );

      expect(isValid).toBe(true);
    });

    it('should reject wrong scrypt password', () => {
      const correctPassword = 'correctPassword';
      const wrongPassword = 'wrongPassword';
      const result = service.scrypt(correctPassword);

      const isValid = service.verifyPassword(
        wrongPassword,
        result.salt,
        result.derivedKey,
        'scrypt',
        { keyLength: result.keyLength },
      );

      expect(isValid).toBe(false);
    });

    it('should default to pbkdf2 method', () => {
      const password = 'testPassword';
      const result = service.pbkdf2(password);

      const isValid = service.verifyPassword(
        password,
        result.salt,
        result.derivedKey,
      );

      expect(isValid).toBe(true);
    });
  });

  describe('demonstrateKdf', () => {
    it('should return demonstration with both methods', () => {
      const demo = service.demonstrateKdf();

      expect(demo).toBeDefined();
      expect(demo.password).toBe('mySecurePassword123!');
      expect(demo.pbkdf2).toBeDefined();
      expect(demo.scrypt).toBeDefined();

      expect(demo.pbkdf2.derivedKey).toBeDefined();
      expect(demo.pbkdf2.salt).toBeDefined();
      expect(demo.pbkdf2.isValid).toBe(true);

      expect(demo.scrypt.derivedKey).toBeDefined();
      expect(demo.scrypt.salt).toBeDefined();
      expect(demo.scrypt.isValid).toBe(true);

      expect(demo.demonstration).toContain(
        'Key derivation functions make brute force attacks computationally expensive',
      );
    });

    it('should show different results for pbkdf2 and scrypt', () => {
      const demo = service.demonstrateKdf();

      expect(demo.pbkdf2.derivedKey).not.toBe(demo.scrypt.derivedKey);
      expect(demo.pbkdf2.salt).not.toBe(demo.scrypt.salt);
    });
  });

  describe('generateSalt', () => {
    it('should generate a salt', () => {
      const salt = service.generateSalt();

      expect(salt).toBeDefined();
      expect(typeof salt).toBe('string');
      expect(salt.length).toBe(32); // 16 bytes * 2 (hex encoding)
    });

    it('should generate different salts each time', () => {
      const salt1 = service.generateSalt();
      const salt2 = service.generateSalt();

      expect(salt1).not.toBe(salt2);
    });

    it('should generate salt with specified length', () => {
      const length = 8;
      const salt = service.generateSalt(length);

      expect(salt.length).toBe(length * 2); // length * 2 (hex encoding)
    });
  });
});
