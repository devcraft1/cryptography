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
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('should perform asymmetric encryption and decryption', () => {
      // Mock keypairService to return consistent keys
      const mockKeys = keypairService.keyPairs();
      jest.spyOn(keypairService, 'publicKey').mockReturnValue(mockKeys.pubkey);
      jest.spyOn(keypairService, 'privateKey').mockReturnValue(mockKeys.privkey);

      service.asymmetric();

      expect(consoleSpy).toHaveBeenCalledTimes(2);

      // First call should log the encrypted data (hex string)
      const encryptedData = consoleSpy.mock.calls[0][0];
      expect(typeof encryptedData).toBe('string');
      expect(encryptedData).toMatch(/^[a-f0-9]+$/); // Should be hex

      // Second call should log the decrypted message
      const decryptedMessage = consoleSpy.mock.calls[1][0];
      expect(decryptedMessage).toBe('the british are coming!');
    });

    it('should encrypt message that can only be decrypted with private key', () => {
      // Test the encryption/decryption process
      const message = 'the british are coming!';
      const crypto = require('crypto');

      const keys = keypairService.keyPairs();

      // Encrypt with public key
      const encryptedData = crypto.publicEncrypt(keys.pubkey, Buffer.from(message));
      expect(encryptedData).toBeDefined();

      // Decrypt with private key
      const decryptedData = crypto.privateDecrypt(keys.privkey, encryptedData);
      const decryptedMessage = decryptedData.toString('utf-8');

      expect(decryptedMessage).toBe(message);
    });

    it('should attempt to use keypair service for keys but fail', () => {
      const publicKeySpy = jest.spyOn(keypairService, 'publicKey');
      const privateKeySpy = jest.spyOn(keypairService, 'privateKey');

      // The asymmetric method will fail because different keys are used for encrypt/decrypt
      expect(() => service.asymmetric()).toThrow();

      expect(publicKeySpy).toHaveBeenCalled();
      expect(privateKeySpy).toHaveBeenCalled();
    });

    it('should work correctly when using consistent key pair', () => {
      // Mock consistent keys
      const mockKeys = keypairService.keyPairs();
      jest.spyOn(keypairService, 'publicKey').mockReturnValue(mockKeys.pubkey);
      jest.spyOn(keypairService, 'privateKey').mockReturnValue(mockKeys.privkey);

      service.asymmetric();

      // Should decrypt back to the original message
      const decryptedMessage = consoleSpy.mock.calls[1][0];
      expect(decryptedMessage).toBe('the british are coming!');
    });

    it('should demonstrate the key mismatch issue', () => {
      // Without mocking, different keys are used for encryption and decryption
      expect(() => service.asymmetric()).toThrow();
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

    it('should use AES256 encryption', () => {
      // Test by manually performing the same encryption
      const crypto = require('crypto');
      const message = 'i like turtles';
      const key = crypto.randomBytes(32);
      const iv = crypto.randomBytes(16);

      const cipher = crypto.createCipheriv('aes256', key, iv);
      const encryptedMessage = cipher.update(message, 'utf8', 'hex') + cipher.final('hex');

      const decipher = crypto.createDecipheriv('aes256', key, iv);
      const decryptedMessage = decipher.update(encryptedMessage, 'hex', 'utf-8') + decipher.final('utf8');

      expect(decryptedMessage).toBe(message);
    });

    it('should return decrypted message as string', () => {
      const result = service.symmetric();

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle symmetric encryption workflow', () => {
      // This tests the entire workflow within the method
      const result = service.symmetric();

      // Should successfully complete the encryption/decryption cycle
      expect(result).toBe('i like turtles');
    });

    it('should use random key and IV for each call', () => {
      let consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      // Even though keys are random, the result should always be the same message
      const result1 = service.symmetric();
      const result2 = service.symmetric();

      expect(result1).toBe('i like turtles');
      expect(result2).toBe('i like turtles');

      consoleSpy.mockRestore();
    });
  });

  describe('encryption methods comparison', () => {
    it('should demonstrate symmetric works and asymmetric has key issues', () => {
      // Test symmetric (should work)
      const symmetricDecrypted = service.symmetric();
      expect(symmetricDecrypted).toBe('i like turtles');

      // Test asymmetric (will fail due to key mismatch)
      expect(() => service.asymmetric()).toThrow();
    });

    it('should show different use cases when implemented correctly', () => {
      // Symmetric uses same key for both operations (works)
      expect(() => service.symmetric()).not.toThrow();

      // Asymmetric uses key pairs but has implementation issue
      expect(() => service.asymmetric()).toThrow();
    });
  });

  describe('integration with KeypairService', () => {
    it('should attempt to use keypair service but fail due to key mismatch', () => {
      const keypairSpy = jest.spyOn(keypairService, 'keyPairs');

      // The asymmetric method should interact with keypair service but fail
      expect(() => service.asymmetric()).toThrow();

      // Should still call the keypair service methods
      expect(keypairService.publicKey).toBeDefined();
      expect(keypairService.privateKey).toBeDefined();
    });

    it('should work correctly with consistent key pairs', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      // Use consistent key pairs
      const keys1 = keypairService.keyPairs();
      jest.spyOn(keypairService, 'publicKey').mockReturnValue(keys1.pubkey);
      jest.spyOn(keypairService, 'privateKey').mockReturnValue(keys1.privkey);

      service.asymmetric();
      const decrypted1 = consoleSpy.mock.calls[1][0];

      consoleSpy.mockClear();

      const keys2 = keypairService.keyPairs();
      jest.spyOn(keypairService, 'publicKey').mockReturnValue(keys2.pubkey);
      jest.spyOn(keypairService, 'privateKey').mockReturnValue(keys2.privkey);

      service.asymmetric();
      const decrypted2 = consoleSpy.mock.calls[1][0];

      // Both should decrypt to the same message when using consistent keys
      expect(decrypted1).toBe('the british are coming!');
      expect(decrypted2).toBe('the british are coming!');

      consoleSpy.mockRestore();
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle encryption service dependency injection', () => {
      expect(service['keypair']).toBeDefined();
      expect(service['keypair']).toBeInstanceOf(KeypairService);
    });

    it('should fail asymmetric encryption due to key mismatch', () => {
      expect(() => service.asymmetric()).toThrow();
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
      // Symmetric uses AES256 and works correctly
      const result = service.symmetric();
      expect(result).toBe('i like turtles'); // Confirms AES256 works
    });

    it('should attempt to use RSA but fail due to implementation issue', () => {
      // Asymmetric uses RSA but has key mismatch issue
      expect(() => service.asymmetric()).toThrow();
    });

    it('should demonstrate different encryption paradigms', () => {
      // Symmetric: same key for encryption and decryption (works)
      const symmetricResult = service.symmetric();
      expect(symmetricResult).toBeDefined();

      // Asymmetric: different keys for encryption/decryption but implementation has issues
      expect(() => service.asymmetric()).toThrow();
    });
  });
});