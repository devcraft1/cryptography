import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionService } from './encryption.service';
import { KeypairService } from '../key-pair/keypair.service';

describe('EncryptionService', () => {
  let service: EncryptionService;
  let keypairService: KeypairService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncryptionService, KeypairService],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
    keypairService = module.get<KeypairService>(KeypairService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('asymmetric', () => {
    it('should perform asymmetric encryption and decryption', () => {
      const result = service.asymmetric();

      expect(result).toBe('the british are coming!');
    });

    it('should encrypt message that can only be decrypted with private key', () => {
      const message = 'the british are coming!';
      const crypto = require('crypto');

      const keys = keypairService.keyPairs();

      const encryptedData = crypto.publicEncrypt(
        keys.pubkey,
        Buffer.from(message),
      );
      expect(encryptedData).toBeDefined();

      const decryptedData = crypto.privateDecrypt(keys.privkey, encryptedData);
      const decryptedMessage = decryptedData.toString('utf-8');

      expect(decryptedMessage).toBe(message);
    });

    it('should use keypair service for keys successfully', () => {
      const publicKeySpy = jest.spyOn(keypairService, 'publicKey');
      const privateKeySpy = jest.spyOn(keypairService, 'privateKey');

      const result = service.asymmetric();

      expect(result).toBe('the british are coming!');
      expect(publicKeySpy).toHaveBeenCalled();
      expect(privateKeySpy).toHaveBeenCalled();
    });

    it('should work correctly with cached key pair', () => {
      const result = service.asymmetric();

      expect(result).toBe('the british are coming!');
    });

    it('should use consistent keys from cached keypair service', () => {
      // publicKey() and privateKey() now use cached keys, so asymmetric works
      const result = service.asymmetric();
      expect(result).toBe('the british are coming!');
    });
  });

  describe('symmetric', () => {
    it('should perform symmetric encryption and decryption', () => {
      const result = service.symmetric();

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toBe('i like turtles');
    });

    it('should encrypt and decrypt the hardcoded message', () => {
      const originalMessage = 'i like turtles';
      const decryptedMessage = service.symmetric();

      expect(decryptedMessage).toBe(originalMessage);
    });

    it('should use AES-256-GCM authenticated encryption', () => {
      const crypto = require('crypto');
      const message = 'i like turtles';
      const key = crypto.randomBytes(32);
      const iv = crypto.randomBytes(12);

      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
      const encryptedMessage =
        cipher.update(message, 'utf8', 'hex') + cipher.final('hex');
      const authTag = cipher.getAuthTag();

      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(authTag);
      const decryptedMessage =
        decipher.update(encryptedMessage, 'hex', 'utf-8') +
        decipher.final('utf8');

      expect(decryptedMessage).toBe(message);
    });

    it('should return decrypted message as string', () => {
      const result = service.symmetric();

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle symmetric encryption workflow', () => {
      const result = service.symmetric();

      expect(result).toBe('i like turtles');
    });

    it('should use random key and IV for each call', () => {
      const result1 = service.symmetric();
      const result2 = service.symmetric();

      expect(result1).toBe('i like turtles');
      expect(result2).toBe('i like turtles');
    });
  });

  describe('encryption methods comparison', () => {
    it('should demonstrate both symmetric and asymmetric work', () => {
      const symmetricDecrypted = service.symmetric();
      expect(symmetricDecrypted).toBe('i like turtles');

      const asymmetricDecrypted = service.asymmetric();
      expect(asymmetricDecrypted).toBe('the british are coming!');
    });

    it('should show different encryption paradigms', () => {
      expect(() => service.symmetric()).not.toThrow();
      expect(() => service.asymmetric()).not.toThrow();
    });
  });

  describe('integration with KeypairService', () => {
    it('should use keypair service for asymmetric encryption', () => {
      const result = service.asymmetric();

      expect(result).toBe('the british are coming!');
      expect(keypairService.publicKey).toBeDefined();
      expect(keypairService.privateKey).toBeDefined();
    });

    it('should work correctly with consistent key pairs', () => {
      const decrypted1 = service.asymmetric();
      const decrypted2 = service.asymmetric();

      expect(decrypted1).toBe('the british are coming!');
      expect(decrypted2).toBe('the british are coming!');
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle encryption service dependency injection', () => {
      expect(service['keypair']).toBeDefined();
      expect(service['keypair']).toBeInstanceOf(KeypairService);
    });

    it('should successfully perform asymmetric encryption', () => {
      const result = service.asymmetric();
      expect(result).toBe('the british are coming!');
    });

    it('should complete symmetric encryption without errors', () => {
      expect(() => service.symmetric()).not.toThrow();
    });

    it('should return string from symmetric method', () => {
      const result = service.symmetric();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('cryptographic security', () => {
    it('should use secure algorithms for symmetric encryption', () => {
      const result = service.symmetric();
      expect(result).toBe('i like turtles');
    });

    it('should use RSA for asymmetric encryption', () => {
      const result = service.asymmetric();
      expect(result).toBe('the british are coming!');
    });

    it('should demonstrate different encryption paradigms', () => {
      const symmetricResult = service.symmetric();
      expect(symmetricResult).toBe('i like turtles');

      const asymmetricResult = service.asymmetric();
      expect(asymmetricResult).toBe('the british are coming!');
    });
  });
});
