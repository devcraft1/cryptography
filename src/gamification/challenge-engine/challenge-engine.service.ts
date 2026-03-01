import { Injectable } from '@nestjs/common';
import { EncodingService } from '../../encoding/encoding.service';
import { HashingService } from '../../hashing/hashing.service';
import { RandomService } from '../../random/random.service';
import { SaltsService } from '../../salts/salts.service';
import { AesGcmService } from '../../aes-gcm/aes-gcm.service';
import { ChaCha20Service } from '../../chacha20/chacha20.service';
import { HmacService } from '../../hmac/hmac.service';
import { KeypairService } from '../../key-pair/keypair.service';
import { EncryptionService } from '../../encryption/encryption.service';
import { DiffieHellmanService } from '../../diffie-hellman/diffie-hellman.service';
import { EccService } from '../../ecc/ecc.service';
import { KeyDerivationService } from '../../key-derivation/key-derivation.service';
import { HkdfService } from '../../hkdf/hkdf.service';
import { DigitalSignaturesService } from '../../digital-signatures/digital-signatures.service';
import { JwtService as CryptoJwtService } from '../../jwt/jwt.service';
import { CertificatesService } from '../../certificates/certificates.service';
import { OtpService } from '../../otp/otp.service';
import { HybridEncryptionService } from '../../hybrid-encryption/hybrid-encryption.service';
import { KeyWrappingService } from '../../key-wrapping/key-wrapping.service';
import { EnvelopeEncryptionService } from '../../envelope-encryption/envelope-encryption.service';
import { CommitmentService } from '../../commitment/commitment.service';
import { SecretSharingService } from '../../secret-sharing/secret-sharing.service';
import { MerkleTreeService } from '../../merkle-tree/merkle-tree.service';
import { BlindSignaturesService } from '../../blind-signatures/blind-signatures.service';
import { ZkpService } from '../../zkp/zkp.service';
import { PostQuantumService } from '../../post-quantum/post-quantum.service';

export interface ChallengeResult {
  correct: boolean;
  xpEarned: number;
  explanation: string;
  expected?: string;
}

@Injectable()
export class ChallengeEngineService {
  constructor(
    private encodingService: EncodingService,
    private hashingService: HashingService,
    private randomService: RandomService,
    private saltsService: SaltsService,
    private aesGcmService: AesGcmService,
    private chacha20Service: ChaCha20Service,
    private hmacService: HmacService,
    private keypairService: KeypairService,
    private encryptionService: EncryptionService,
    private diffieHellmanService: DiffieHellmanService,
    private eccService: EccService,
    private keyDerivationService: KeyDerivationService,
    private hkdfService: HkdfService,
    private digitalSignaturesService: DigitalSignaturesService,
    private cryptoJwtService: CryptoJwtService,
    private certificatesService: CertificatesService,
    private otpService: OtpService,
    private hybridEncryptionService: HybridEncryptionService,
    private keyWrappingService: KeyWrappingService,
    private envelopeEncryptionService: EnvelopeEncryptionService,
    private commitmentService: CommitmentService,
    private secretSharingService: SecretSharingService,
    private merkleTreeService: MerkleTreeService,
    private blindSignaturesService: BlindSignaturesService,
    private zkpService: ZkpService,
    private postQuantumService: PostQuantumService,
  ) {}

  async validate(
    cryptoModule: string,
    challengeType: string,
    config: Record<string, any>,
    userAnswer: any,
  ): Promise<ChallengeResult> {
    try {
      const handler = this.getHandler(cryptoModule, challengeType);
      return await handler(config, userAnswer);
    } catch {
      return {
        correct: false,
        xpEarned: 0,
        explanation: 'An error occurred while validating your answer. Please try again.',
      };
    }
  }

  private getHandler(
    module: string,
    type: string,
  ): (config: any, answer: any) => Promise<ChallengeResult> {
    const handlers: Record<string, (config: any, answer: any) => Promise<ChallengeResult>> = {
      'encoding:decode': this.validateEncodingDecode.bind(this),
      'encoding:encode': this.validateEncodingEncode.bind(this),
      'encoding:multi_choice': this.validateMultiChoice.bind(this),
      'hashing:generate': this.validateHashGenerate.bind(this),
      'hashing:verify': this.validateHashVerify.bind(this),
      'hashing:multi_choice': this.validateMultiChoice.bind(this),
      'random:generate': this.validateRandomGenerate.bind(this),
      'random:multi_choice': this.validateMultiChoice.bind(this),
      'salts:multi_choice': this.validateMultiChoice.bind(this),
      'salts:explain': this.validateExplain.bind(this),
      'symmetric-encryption:encrypt': this.validateAesEncrypt.bind(this),
      'symmetric-encryption:decrypt': this.validateAesDecrypt.bind(this),
      'aes-gcm:encrypt': this.validateAesEncrypt.bind(this),
      'aes-gcm:decrypt': this.validateAesDecrypt.bind(this),
      'aes-gcm:multi_choice': this.validateMultiChoice.bind(this),
      'chacha20:encrypt': this.validateChaCha20Encrypt.bind(this),
      'chacha20:multi_choice': this.validateMultiChoice.bind(this),
      'hmac:generate': this.validateHmacGenerate.bind(this),
      'hmac:verify': this.validateHmacVerify.bind(this),
      'hmac:multi_choice': this.validateMultiChoice.bind(this),
      'key-pair:generate': this.validateKeyPairGenerate.bind(this),
      'key-pair:multi_choice': this.validateMultiChoice.bind(this),
      'asymmetric-encryption:encrypt': this.validateAsymmetricEncrypt.bind(this),
      'asymmetric-encryption:multi_choice': this.validateMultiChoice.bind(this),
      'diffie-hellman:generate': this.validateDHGenerate.bind(this),
      'diffie-hellman:multi_choice': this.validateMultiChoice.bind(this),
      'ecc:sign': this.validateEccSign.bind(this),
      'ecc:verify': this.validateEccVerify.bind(this),
      'ecc:multi_choice': this.validateMultiChoice.bind(this),
      'key-derivation:generate': this.validateKeyDerivation.bind(this),
      'key-derivation:multi_choice': this.validateMultiChoice.bind(this),
      'hkdf:generate': this.validateHkdf.bind(this),
      'hkdf:multi_choice': this.validateMultiChoice.bind(this),
      'digital-signatures:sign': this.validateDigitalSign.bind(this),
      'digital-signatures:verify': this.validateDigitalVerify.bind(this),
      'digital-signatures:multi_choice': this.validateMultiChoice.bind(this),
      'jwt:generate': this.validateJwtGenerate.bind(this),
      'jwt:verify': this.validateJwtVerify.bind(this),
      'jwt:decode': this.validateJwtDecode.bind(this),
      'jwt:multi_choice': this.validateMultiChoice.bind(this),
      'certificates:multi_choice': this.validateMultiChoice.bind(this),
      'certificates:generate': this.validateCertGenerate.bind(this),
      'otp:generate': this.validateOtpGenerate.bind(this),
      'otp:verify': this.validateOtpVerify.bind(this),
      'otp:multi_choice': this.validateMultiChoice.bind(this),
      'hybrid-encryption:encrypt': this.validateHybridEncrypt.bind(this),
      'hybrid-encryption:multi_choice': this.validateMultiChoice.bind(this),
      'key-wrapping:generate': this.validateKeyWrap.bind(this),
      'key-wrapping:multi_choice': this.validateMultiChoice.bind(this),
      'envelope-encryption:encrypt': this.validateEnvelopeEncrypt.bind(this),
      'envelope-encryption:multi_choice': this.validateMultiChoice.bind(this),
      'commitment:generate': this.validateCommitment.bind(this),
      'commitment:verify': this.validateCommitmentVerify.bind(this),
      'commitment:multi_choice': this.validateMultiChoice.bind(this),
      'secret-sharing:generate': this.validateSecretSplit.bind(this),
      'secret-sharing:verify': this.validateSecretCombine.bind(this),
      'secret-sharing:multi_choice': this.validateMultiChoice.bind(this),
      'merkle-tree:generate': this.validateMerkleTree.bind(this),
      'merkle-tree:verify': this.validateMerkleVerify.bind(this),
      'merkle-tree:multi_choice': this.validateMultiChoice.bind(this),
      'blind-signatures:multi_step': this.validateBlindSig.bind(this),
      'blind-signatures:multi_choice': this.validateMultiChoice.bind(this),
      'zkp:multi_step': this.validateZkp.bind(this),
      'zkp:multi_choice': this.validateMultiChoice.bind(this),
      'post-quantum:generate': this.validatePostQuantum.bind(this),
      'post-quantum:multi_choice': this.validateMultiChoice.bind(this),
    };

    const key = `${module}:${type}`;
    return handlers[key] || this.validateMultiChoice.bind(this);
  }

  // --- Generic Validators ---

  private async validateMultiChoice(config: any, answer: any): Promise<ChallengeResult> {
    const correct = answer.selected === config.correctAnswer;
    return {
      correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct
        ? config.correctExplanation || 'Correct! Well done, agent.'
        : config.wrongExplanation || `Incorrect. The correct answer is: ${config.correctAnswer}`,
    };
  }

  private async validateExplain(config: any, answer: any): Promise<ChallengeResult> {
    const keywords = (config.keywords || []) as string[];
    const text = (answer.text || '').toLowerCase();
    const matched = keywords.filter((k: string) => text.includes(k.toLowerCase()));
    const correct = matched.length >= Math.ceil(keywords.length * 0.5);
    return {
      correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct
        ? 'Good explanation! You demonstrated understanding of the key concepts.'
        : `Your explanation should cover these concepts: ${keywords.join(', ')}`,
    };
  }

  // --- Chapter 1: Foundation ---

  private async validateEncodingDecode(config: any, answer: any): Promise<ChallengeResult> {
    let expected: string;
    if (config.encoding === 'base64') {
      const result = this.encodingService.base64Decode(config.input);
      expected = (result as any).decoded;
    } else {
      const result = this.encodingService.hexDecode(config.input);
      expected = (result as any).decoded;
    }
    const correct = answer.result === expected;
    return {
      correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct
        ? `Correct! The ${config.encoding} decoded value is: ${expected}`
        : `Incorrect. The decoded value should be: ${expected}`,
      expected,
    };
  }

  private async validateEncodingEncode(config: any, answer: any): Promise<ChallengeResult> {
    let expected: string;
    if (config.encoding === 'base64') {
      const result = this.encodingService.base64Encode(config.input);
      expected = (result as any).encoded;
    } else {
      const result = this.encodingService.hexEncode(config.input);
      expected = (result as any).encoded;
    }
    const correct = answer.result === expected;
    return {
      correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct
        ? `Correct! The ${config.encoding} encoded value is: ${expected}`
        : `Incorrect. The encoded value should be: ${expected}`,
      expected,
    };
  }

  private async validateHashGenerate(config: any, answer: any): Promise<ChallengeResult> {
    const result = this.hashingService.hash({ text: config.input, algorithm: config.algorithm || 'sha256' });
    const expected = typeof result === 'string' ? result : (result as any).hash;
    const correct = answer.result?.toLowerCase() === expected?.toLowerCase();
    return {
      correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct
        ? 'Correct! Hash values are deterministic — same input always produces the same output.'
        : `Incorrect. The correct hash is: ${expected}`,
      expected,
    };
  }

  private async validateHashVerify(config: any, answer: any): Promise<ChallengeResult> {
    const correct = answer.selected === config.correctAnswer;
    return {
      correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct
        ? 'Correct! You successfully verified the hash integrity.'
        : 'Incorrect. Remember: even a tiny change in input produces a completely different hash.',
    };
  }

  private async validateRandomGenerate(config: any, answer: any): Promise<ChallengeResult> {
    const hex = answer.result || '';
    const expectedBytes = config.bytes || 16;
    const correct = /^[0-9a-f]+$/i.test(hex) && hex.length === expectedBytes * 2;
    return {
      correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct
        ? 'Correct! You generated cryptographically secure random bytes.'
        : `Expected ${expectedBytes} bytes of hex (${expectedBytes * 2} hex chars). Ensure you use a CSPRNG.`,
    };
  }

  // --- Chapter 2: Secure the Vault ---

  private async validateAesEncrypt(config: any, answer: any): Promise<ChallengeResult> {
    try {
      const decrypted = this.aesGcmService.decrypt(
        answer.ciphertext,
        answer.key,
        answer.iv,
        answer.authTag,
      );
      const correct = (decrypted as any).plaintext === config.plaintext;
      return {
        correct,
        xpEarned: correct ? config.xpReward || 25 : 0,
        explanation: correct
          ? 'Correct! Your AES-GCM encryption is valid — the ciphertext decrypts back to the original message.'
          : 'Incorrect. The ciphertext did not decrypt to the expected plaintext.',
      };
    } catch {
      return {
        correct: false,
        xpEarned: 0,
        explanation: 'Invalid encryption output. Make sure you provide ciphertext, key, iv, and authTag.',
      };
    }
  }

  private async validateAesDecrypt(config: any, answer: any): Promise<ChallengeResult> {
    const correct = answer.result === config.expectedPlaintext;
    return {
      correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct
        ? 'Correct! You successfully decrypted the AES-GCM ciphertext.'
        : `Incorrect. The plaintext should be: ${config.expectedPlaintext}`,
    };
  }

  private async validateChaCha20Encrypt(config: any, answer: any): Promise<ChallengeResult> {
    try {
      const decrypted = this.chacha20Service.decrypt(
        answer.ciphertext,
        answer.key,
        answer.iv,
        answer.authTag,
        answer.aad,
      );
      const correct = decrypted.plaintext === config.plaintext;
      return {
        correct,
        xpEarned: correct ? config.xpReward || 25 : 0,
        explanation: correct
          ? 'Correct! Your ChaCha20-Poly1305 encryption is valid.'
          : 'Incorrect. The ciphertext did not decrypt to the expected plaintext.',
      };
    } catch {
      return { correct: false, xpEarned: 0, explanation: 'Invalid ChaCha20 encryption output.' };
    }
  }

  private async validateHmacGenerate(config: any, answer: any): Promise<ChallengeResult> {
    const expected = this.hmacService.generateHmac(config.message, config.key, config.algorithm || 'sha256');
    const correct = answer.result?.toLowerCase() === expected?.toLowerCase();
    return {
      correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct
        ? 'Correct! The HMAC matches — message integrity verified.'
        : `Incorrect. Expected HMAC: ${expected}`,
      expected,
    };
  }

  private async validateHmacVerify(config: any, answer: any): Promise<ChallengeResult> {
    const isValid = this.hmacService.verifyHmac(config.message, config.key, config.hmac, config.algorithm);
    const correct = answer.selected === (isValid ? 'valid' : 'invalid');
    return {
      correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct
        ? 'Correct! You correctly identified the HMAC validity.'
        : `Incorrect. The HMAC is ${isValid ? 'valid' : 'invalid'}.`,
    };
  }

  // --- Chapter 3: Trust No One ---

  private async validateKeyPairGenerate(config: any, answer: any): Promise<ChallengeResult> {
    const hasPublic = answer.publicKey && answer.publicKey.includes('PUBLIC KEY');
    const hasPrivate = answer.privateKey && answer.privateKey.includes('PRIVATE KEY');
    const correct = hasPublic && hasPrivate;
    return {
      correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct
        ? 'Correct! You generated a valid RSA key pair.'
        : 'Incorrect. A valid key pair must contain both a PUBLIC KEY and PRIVATE KEY in PEM format.',
    };
  }

  private async validateAsymmetricEncrypt(config: any, answer: any): Promise<ChallengeResult> {
    const correct = answer.result === config.expectedPlaintext;
    return {
      correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct
        ? 'Correct! You demonstrated asymmetric encryption/decryption.'
        : 'Incorrect. Remember: encrypt with public key, decrypt with private key.',
    };
  }

  private async validateDHGenerate(config: any, answer: any): Promise<ChallengeResult> {
    const correct = answer.sharedSecret && answer.sharedSecret.length > 0;
    return {
      correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct
        ? 'Correct! Both parties derived the same shared secret without transmitting it.'
        : 'Incorrect. The Diffie-Hellman exchange should produce a shared secret.',
    };
  }

  private async validateEccSign(config: any, answer: any): Promise<ChallengeResult> {
    try {
      const result = this.eccService.verify(config.message, answer.signature, answer.publicKey);
      const correct = (result as any).isValid;
      return {
        correct,
        xpEarned: correct ? config.xpReward || 25 : 0,
        explanation: correct
          ? 'Correct! Your ECC signature is valid.'
          : 'Incorrect. The signature could not be verified against the message and public key.',
      };
    } catch {
      return { correct: false, xpEarned: 0, explanation: 'Invalid signature format.' };
    }
  }

  private async validateEccVerify(config: any, answer: any): Promise<ChallengeResult> {
    const result = this.eccService.verify(config.message, config.signature, config.publicKey);
    const isValid = (result as any).isValid;
    const correct = answer.selected === (isValid ? 'valid' : 'invalid');
    return {
      correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct
        ? 'Correct!'
        : `Incorrect. The signature is ${isValid ? 'valid' : 'invalid'}.`,
    };
  }

  private async validateKeyDerivation(config: any, answer: any): Promise<ChallengeResult> {
    const result = this.keyDerivationService.pbkdf2(config.password, config.salt, config.iterations);
    const expected = (result as any).derivedKey;
    const correct = answer.result?.toLowerCase() === expected?.toLowerCase();
    return {
      correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct
        ? 'Correct! You derived the correct key from the password.'
        : `Incorrect. Expected derived key: ${expected?.substring(0, 32)}...`,
    };
  }

  private async validateHkdf(config: any, answer: any): Promise<ChallengeResult> {
    const result = this.hkdfService.derive(config.ikm, config.salt, config.info, config.keyLength);
    const expected = (result as any).derivedKey;
    const correct = answer.result?.toLowerCase() === expected?.toLowerCase();
    return {
      correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct
        ? 'Correct! HKDF derived the expected key material.'
        : `Incorrect. Expected: ${expected?.substring(0, 32)}...`,
    };
  }

  // --- Chapter 4: Authenticate Everything ---

  private async validateDigitalSign(config: any, answer: any): Promise<ChallengeResult> {
    try {
      const isValid = this.digitalSignaturesService.verifySignature(
        config.message,
        answer.signature,
        answer.publicKey || config.publicKey,
      );
      return {
        correct: isValid,
        xpEarned: isValid ? config.xpReward || 25 : 0,
        explanation: isValid
          ? 'Correct! Your digital signature is valid.'
          : 'Incorrect. The signature verification failed.',
      };
    } catch {
      return { correct: false, xpEarned: 0, explanation: 'Invalid signature format.' };
    }
  }

  private async validateDigitalVerify(config: any, answer: any): Promise<ChallengeResult> {
    const isValid = this.digitalSignaturesService.verifySignature(
      config.message,
      config.signature,
      config.publicKey,
    );
    const correct = answer.selected === (isValid ? 'valid' : 'invalid');
    return {
      correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct
        ? 'Correct!'
        : `The signature is ${isValid ? 'valid' : 'invalid'}.`,
    };
  }

  private async validateJwtGenerate(config: any, answer: any): Promise<ChallengeResult> {
    try {
      const result = this.cryptoJwtService.verify(answer.token, config.secret, 'HS256');
      const correct = (result as any).isValid;
      return {
        correct,
        xpEarned: correct ? config.xpReward || 25 : 0,
        explanation: correct
          ? 'Correct! Your JWT is valid and properly signed.'
          : 'Incorrect. The JWT could not be verified.',
      };
    } catch {
      return { correct: false, xpEarned: 0, explanation: 'Invalid JWT format.' };
    }
  }

  private async validateJwtVerify(config: any, answer: any): Promise<ChallengeResult> {
    const result = this.cryptoJwtService.verify(config.token, config.secret, config.algorithm || 'HS256');
    const isValid = (result as any).isValid;
    const correct = answer.selected === (isValid ? 'valid' : 'invalid');
    return {
      correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct ? 'Correct!' : `The JWT is ${isValid ? 'valid' : 'invalid'}.`,
    };
  }

  private async validateJwtDecode(config: any, answer: any): Promise<ChallengeResult> {
    const decoded = this.cryptoJwtService.decode(config.token);
    const expectedPayload = JSON.stringify((decoded as any).payload);
    const correct = answer.result === expectedPayload || JSON.stringify(answer.payload) === expectedPayload;
    return {
      correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct
        ? 'Correct! You decoded the JWT payload.'
        : `Expected payload: ${expectedPayload}`,
    };
  }

  private async validateCertGenerate(config: any, answer: any): Promise<ChallengeResult> {
    const correct = answer.certificate && answer.signature;
    return {
      correct: !!correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct
        ? 'Correct! You generated a self-signed certificate.'
        : 'A certificate requires both the certificate data and a signature.',
    };
  }

  private async validateOtpGenerate(config: any, answer: any): Promise<ChallengeResult> {
    const result = this.otpService.verifyHotp(answer.otp, config.secret, config.counter);
    const correct = (result as any).isValid;
    return {
      correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct
        ? 'Correct! The OTP is valid for the given secret and counter.'
        : 'Incorrect OTP. Check the secret and counter values.',
    };
  }

  private async validateOtpVerify(config: any, answer: any): Promise<ChallengeResult> {
    const result = this.otpService.verifyHotp(config.otp, config.secret, config.counter);
    const isValid = (result as any).isValid;
    const correct = answer.selected === (isValid ? 'valid' : 'invalid');
    return {
      correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct ? 'Correct!' : `The OTP is ${isValid ? 'valid' : 'invalid'}.`,
    };
  }

  // --- Chapter 5: Defense in Depth ---

  private async validateHybridEncrypt(config: any, answer: any): Promise<ChallengeResult> {
    const correct = answer.encryptedKey && answer.ciphertext && answer.iv && answer.authTag;
    return {
      correct: !!correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct
        ? 'Correct! Hybrid encryption combines asymmetric key exchange with symmetric encryption.'
        : 'You need to provide encryptedKey, ciphertext, iv, and authTag.',
    };
  }

  private async validateKeyWrap(config: any, answer: any): Promise<ChallengeResult> {
    try {
      const unwrapped = this.keyWrappingService.unwrap(
        answer.wrappedKey,
        answer.kek,
        answer.iv,
        answer.authTag,
      );
      const correct = (unwrapped as any).unwrappedKey === config.dataKey;
      return {
        correct,
        xpEarned: correct ? config.xpReward || 25 : 0,
        explanation: correct
          ? 'Correct! The data key was properly wrapped and can be unwrapped.'
          : 'Incorrect. The unwrapped key does not match the original data key.',
      };
    } catch {
      return { correct: false, xpEarned: 0, explanation: 'Invalid key wrapping output.' };
    }
  }

  private async validateEnvelopeEncrypt(config: any, answer: any): Promise<ChallengeResult> {
    try {
      const result = this.envelopeEncryptionService.decrypt(answer.envelope, answer.masterKey);
      const correct = (result as any).plaintext === config.plaintext;
      return {
        correct,
        xpEarned: correct ? config.xpReward || 25 : 0,
        explanation: correct
          ? 'Correct! Envelope encryption protects data keys with a master key.'
          : 'Incorrect. The decrypted plaintext does not match.',
      };
    } catch {
      return { correct: false, xpEarned: 0, explanation: 'Invalid envelope encryption output.' };
    }
  }

  // --- Chapter 6: Covert Protocols ---

  private async validateCommitment(config: any, answer: any): Promise<ChallengeResult> {
    const result = this.commitmentService.verify(config.value, answer.nonce, answer.commitment);
    const correct = (result as any).isValid;
    return {
      correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct
        ? 'Correct! Your commitment is valid — it proves you committed to the value without revealing it early.'
        : 'Incorrect. The commitment does not verify against the value and nonce.',
    };
  }

  private async validateCommitmentVerify(config: any, answer: any): Promise<ChallengeResult> {
    const result = this.commitmentService.verify(config.value, config.nonce, config.commitment);
    const isValid = (result as any).isValid;
    const correct = answer.selected === (isValid ? 'valid' : 'invalid');
    return {
      correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct ? 'Correct!' : `The commitment is ${isValid ? 'valid' : 'invalid'}.`,
    };
  }

  private async validateSecretSplit(config: any, answer: any): Promise<ChallengeResult> {
    const correct =
      Array.isArray(answer.shares) &&
      answer.shares.length === (config.totalShares || 5) &&
      answer.threshold === (config.threshold || 3);
    return {
      correct: !!correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct
        ? `Correct! The secret is split into ${config.totalShares} shares with threshold ${config.threshold}.`
        : `Expected ${config.totalShares} shares with threshold ${config.threshold}.`,
    };
  }

  private async validateSecretCombine(config: any, answer: any): Promise<ChallengeResult> {
    try {
      const result = this.secretSharingService.combine(config.shares);
      const correct = answer.result === (result as any).secret;
      return {
        correct,
        xpEarned: correct ? config.xpReward || 25 : 0,
        explanation: correct
          ? 'Correct! You reconstructed the secret from the shares.'
          : `Incorrect. The reconstructed secret should be: ${(result as any).secret}`,
      };
    } catch {
      return { correct: false, xpEarned: 0, explanation: 'Failed to combine shares.' };
    }
  }

  private async validateMerkleTree(config: any, answer: any): Promise<ChallengeResult> {
    const tree = this.merkleTreeService.buildTree(config.leaves);
    const correct = answer.root?.toLowerCase() === tree.root?.toLowerCase();
    return {
      correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct
        ? 'Correct! You computed the Merkle root.'
        : `Incorrect. Expected root: ${tree.root}`,
      expected: tree.root,
    };
  }

  private async validateMerkleVerify(config: any, answer: any): Promise<ChallengeResult> {
    const isValid = this.merkleTreeService.verifyProof(config.leaf, config.proof, config.root);
    const correct = answer.selected === (isValid ? 'valid' : 'invalid');
    return {
      correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct ? 'Correct!' : `The proof is ${isValid ? 'valid' : 'invalid'}.`,
    };
  }

  private async validateBlindSig(config: any, answer: any): Promise<ChallengeResult> {
    if (config.step === 'blind') {
      const correct = answer.blindedMessage && answer.blindingFactor;
      return {
        correct: !!correct,
        xpEarned: correct ? config.xpReward || 25 : 0,
        explanation: correct
          ? 'Step complete! You blinded the message. The signer cannot see the original.'
          : 'You need to provide blindedMessage and blindingFactor.',
      };
    }
    if (config.step === 'verify') {
      try {
        const result = this.blindSignaturesService.verify(
          config.message,
          answer.signature,
          config.publicKeyN,
          config.publicKeyE,
        );
        return {
          correct: (result as any).isValid,
          xpEarned: (result as any).isValid ? config.xpReward || 25 : 0,
          explanation: (result as any).isValid
            ? 'Correct! The unblinded signature is valid.'
            : 'The signature verification failed.',
        };
      } catch {
        return { correct: false, xpEarned: 0, explanation: 'Invalid blind signature.' };
      }
    }
    return { correct: true, xpEarned: config.xpReward || 25, explanation: 'Step complete.' };
  }

  private async validateZkp(config: any, answer: any): Promise<ChallengeResult> {
    if (config.step === 'commit') {
      const correct = answer.commitment && answer.publicValue;
      return {
        correct: !!correct,
        xpEarned: correct ? config.xpReward || 25 : 0,
        explanation: correct
          ? 'Step complete! Commitment created without revealing the secret.'
          : 'Provide commitment and publicValue.',
      };
    }
    if (config.step === 'verify') {
      const result = this.zkpService.verify(
        config.publicValue,
        config.commitment,
        config.challenge,
        answer.response,
      );
      return {
        correct: (result as any).isValid,
        xpEarned: (result as any).isValid ? config.xpReward || 25 : 0,
        explanation: (result as any).isValid
          ? 'Correct! Zero-knowledge proof verified — you proved knowledge without revealing the secret.'
          : 'Verification failed. Check your response calculation.',
      };
    }
    return { correct: true, xpEarned: config.xpReward || 25, explanation: 'Step complete.' };
  }

  // --- Chapter 7: The Quantum Threat ---

  private async validatePostQuantum(config: any, answer: any): Promise<ChallengeResult> {
    if (config.algorithm === 'ml-kem') {
      const correct = answer.publicKey && answer.secretKey;
      return {
        correct: !!correct,
        xpEarned: correct ? config.xpReward || 25 : 0,
        explanation: correct
          ? 'Correct! You generated ML-KEM (Kyber) post-quantum key pair.'
          : 'Provide both publicKey and secretKey.',
      };
    }
    if (config.algorithm === 'ml-dsa') {
      try {
        const result = this.postQuantumService.dsaVerify(
          answer.signature,
          config.message,
          answer.publicKey || config.publicKey,
          config.variant || '65',
        );
        return {
          correct: (result as any).isValid,
          xpEarned: (result as any).isValid ? config.xpReward || 25 : 0,
          explanation: (result as any).isValid
            ? 'Correct! ML-DSA (Dilithium) signature verified.'
            : 'Signature verification failed.',
        };
      } catch {
        return { correct: false, xpEarned: 0, explanation: 'Invalid ML-DSA signature.' };
      }
    }
    const correct = answer.publicKey && answer.secretKey;
    return {
      correct: !!correct,
      xpEarned: correct ? config.xpReward || 25 : 0,
      explanation: correct
        ? 'Correct! Post-quantum key pair generated.'
        : 'Provide the key pair.',
    };
  }
}
