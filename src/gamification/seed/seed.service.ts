import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chapter, Quest, Challenge, Achievement } from '../entities';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Chapter) private chapterModel: typeof Chapter,
    @InjectModel(Quest) private questModel: typeof Quest,
    @InjectModel(Challenge) private challengeModel: typeof Challenge,
    @InjectModel(Achievement) private achievementModel: typeof Achievement,
  ) {}

  async onModuleInit() {
    const chapterCount = await this.chapterModel.count();
    if (chapterCount > 0) {
      this.logger.log('Seed data already exists, skipping.');
      return;
    }
    this.logger.log('Seeding game data...');
    await this.seedChapters();
    await this.seedAchievements();
    this.logger.log('Seed complete!');
  }

  private async seedChapters() {
    const chapters = [
      {
        id: 1, slug: 'the-foundation', title: 'The Foundation', subtitle: 'Every cipher begins with the basics',
        narrativeIntro: 'Welcome to CipherVault, recruit. The Nullifier has begun dismantling the world\'s cryptographic infrastructure. Your training starts here — master the foundations of encoding, randomness, and hashing before the enemy erases them from existence.',
        rank: 'Recruit', orderIndex: 1, requiredXp: 0,
      },
      {
        id: 2, slug: 'secure-the-vault', title: 'Secure the Vault', subtitle: 'Lock down communications',
        narrativeIntro: 'Field Agent, The Nullifier\'s operatives have intercepted unencrypted transmissions. Your mission: master symmetric encryption to secure CipherVault\'s communications. AES-GCM, ChaCha20, and HMAC are your new weapons.',
        rank: 'Field Agent', orderIndex: 2, requiredXp: 400,
      },
      {
        id: 3, slug: 'trust-no-one', title: 'Trust No One', subtitle: 'Establish identity in a compromised world',
        narrativeIntro: 'Operative, The Nullifier has compromised key exchange protocols worldwide. You must master asymmetric cryptography — key pairs, Diffie-Hellman, and elliptic curves — to rebuild trust in a world where no one can be verified.',
        rank: 'Operative', orderIndex: 3, requiredXp: 1200,
      },
      {
        id: 4, slug: 'authenticate-everything', title: 'Authenticate Everything', subtitle: 'Prove who you are',
        narrativeIntro: 'Senior Operative, forged identities are flooding the network. Digital signatures, JWTs, certificates, and one-time passwords are your tools to authenticate every message, every agent, every transaction.',
        rank: 'Senior Operative', orderIndex: 4, requiredXp: 2500,
      },
      {
        id: 5, slug: 'defense-in-depth', title: 'Defense in Depth', subtitle: 'Layer your defenses',
        narrativeIntro: 'Specialist, The Nullifier is targeting individual encryption layers. Your mission: combine multiple cryptographic techniques — hybrid encryption, key wrapping, and envelope encryption — to create unbreakable defense.',
        rank: 'Specialist', orderIndex: 5, requiredXp: 4000,
      },
      {
        id: 6, slug: 'covert-protocols', title: 'Covert Protocols', subtitle: 'Advanced cryptographic operations',
        narrativeIntro: 'Cryptanalyst, you\'ve proven yourself. Now enter the world of advanced protocols — commitment schemes, secret sharing, Merkle trees, blind signatures, and zero-knowledge proofs. These are the tools of true cryptographic mastery.',
        rank: 'Cryptanalyst', orderIndex: 6, requiredXp: 5500,
      },
      {
        id: 7, slug: 'the-quantum-threat', title: 'The Quantum Threat', subtitle: 'Prepare for the future',
        narrativeIntro: 'Director, our intelligence reveals The Nullifier\'s endgame: a quantum computer capable of breaking all classical cryptography. You must master post-quantum algorithms — ML-KEM, ML-DSA, and SLH-DSA — to secure the future.',
        rank: 'Director', orderIndex: 7, requiredXp: 7500,
      },
    ];

    for (const ch of chapters) {
      await this.chapterModel.create(ch);
    }

    await this.seedQuests();
  }

  private async seedQuests() {
    const quests = [
      // Chapter 1: The Foundation
      { slug: 'encoding-basics', chapterId: 1, title: 'Encoding: The Language of Data', description: 'Learn how data is represented in different formats. Base64, hex, and URL encoding are the alphabet of cryptography.', orderIndex: 1, cryptoModule: 'encoding', difficulty: 'beginner', xpReward: 100, estimatedMinutes: 10 },
      { slug: 'randomness', chapterId: 1, title: 'Randomness: The Unpredictable Foundation', description: 'True randomness is the bedrock of all cryptography. Learn to generate cryptographically secure random values.', orderIndex: 2, cryptoModule: 'random', difficulty: 'beginner', xpReward: 100, estimatedMinutes: 8 },
      { slug: 'hashing-fundamentals', chapterId: 1, title: 'Hashing: Digital Fingerprints', description: 'Hash functions create unique fingerprints for data. Learn SHA-256 and understand why hashing is one-way.', orderIndex: 3, cryptoModule: 'hashing', difficulty: 'beginner', xpReward: 100, estimatedMinutes: 12 },
      { slug: 'salts-and-passwords', chapterId: 1, title: 'Salts: Protecting Passwords', description: 'Salts prevent rainbow table attacks. Learn how to properly salt and hash passwords.', orderIndex: 4, cryptoModule: 'salts', difficulty: 'beginner', xpReward: 100, estimatedMinutes: 10 },

      // Chapter 2: Secure the Vault
      { slug: 'symmetric-encryption', chapterId: 2, title: 'Symmetric Encryption: One Key to Rule Them All', description: 'Symmetric encryption uses the same key for encryption and decryption. Master AES and understand block ciphers.', orderIndex: 1, cryptoModule: 'symmetric-encryption', difficulty: 'intermediate', xpReward: 150, estimatedMinutes: 15 },
      { slug: 'aes-gcm', chapterId: 2, title: 'AES-GCM: Authenticated Encryption', description: 'AES-GCM provides both confidentiality and authenticity. Learn why authenticated encryption is essential.', orderIndex: 2, cryptoModule: 'aes-gcm', difficulty: 'intermediate', xpReward: 150, estimatedMinutes: 15 },
      { slug: 'chacha20-stream', chapterId: 2, title: 'ChaCha20: The Stream Cipher', description: 'ChaCha20-Poly1305 is a modern alternative to AES. Learn stream ciphers and their advantages.', orderIndex: 3, cryptoModule: 'chacha20', difficulty: 'intermediate', xpReward: 150, estimatedMinutes: 12 },
      { slug: 'hmac-integrity', chapterId: 2, title: 'HMAC: Message Integrity', description: 'HMAC ensures messages haven\'t been tampered with. Learn keyed hashing for authentication.', orderIndex: 4, cryptoModule: 'hmac', difficulty: 'intermediate', xpReward: 150, estimatedMinutes: 12 },

      // Chapter 3: Trust No One
      { slug: 'key-pairs', chapterId: 3, title: 'Key Pairs: Public and Private', description: 'Asymmetric cryptography uses key pairs. Learn to generate and use RSA key pairs.', orderIndex: 1, cryptoModule: 'key-pair', difficulty: 'intermediate', xpReward: 150, estimatedMinutes: 12 },
      { slug: 'asymmetric-encryption', chapterId: 3, title: 'Asymmetric Encryption: Trust Without Sharing', description: 'Encrypt with a public key, decrypt with private. The foundation of secure communication.', orderIndex: 2, cryptoModule: 'asymmetric-encryption', difficulty: 'intermediate', xpReward: 150, estimatedMinutes: 15 },
      { slug: 'diffie-hellman-exchange', chapterId: 3, title: 'Diffie-Hellman: Agreeing on Secrets', description: 'Exchange keys over an insecure channel. The magic of Diffie-Hellman key agreement.', orderIndex: 3, cryptoModule: 'diffie-hellman', difficulty: 'advanced', xpReward: 200, estimatedMinutes: 15 },
      { slug: 'elliptic-curves', chapterId: 3, title: 'ECC: Curves of Power', description: 'Elliptic Curve Cryptography provides stronger security with smaller keys. Master ECDSA signing.', orderIndex: 4, cryptoModule: 'ecc', difficulty: 'advanced', xpReward: 200, estimatedMinutes: 15 },
      { slug: 'key-derivation-functions', chapterId: 3, title: 'Key Derivation: Passwords to Keys', description: 'Transform passwords into cryptographic keys using PBKDF2 and scrypt.', orderIndex: 5, cryptoModule: 'key-derivation', difficulty: 'intermediate', xpReward: 150, estimatedMinutes: 12 },
      { slug: 'hkdf-expansion', chapterId: 3, title: 'HKDF: Deriving Multiple Keys', description: 'HKDF extracts and expands key material. Learn to derive multiple keys from one source.', orderIndex: 6, cryptoModule: 'hkdf', difficulty: 'intermediate', xpReward: 150, estimatedMinutes: 10 },

      // Chapter 4: Authenticate Everything
      { slug: 'digital-signatures-auth', chapterId: 4, title: 'Digital Signatures: Unforgeable Proof', description: 'Sign messages to prove authorship and prevent tampering. The backbone of digital trust.', orderIndex: 1, cryptoModule: 'digital-signatures', difficulty: 'advanced', xpReward: 200, estimatedMinutes: 15 },
      { slug: 'jwt-tokens', chapterId: 4, title: 'JWT: Stateless Authentication', description: 'JSON Web Tokens carry verified claims. Learn to create, sign, and verify JWTs.', orderIndex: 2, cryptoModule: 'jwt', difficulty: 'advanced', xpReward: 200, estimatedMinutes: 15 },
      { slug: 'certificates-pki', chapterId: 4, title: 'Certificates: The Chain of Trust', description: 'X.509 certificates bind identities to public keys. Learn PKI fundamentals.', orderIndex: 3, cryptoModule: 'certificates', difficulty: 'advanced', xpReward: 200, estimatedMinutes: 15 },
      { slug: 'one-time-passwords', chapterId: 4, title: 'OTP: Time-Based Secrets', description: 'HOTP and TOTP generate one-time passwords for two-factor authentication.', orderIndex: 4, cryptoModule: 'otp', difficulty: 'intermediate', xpReward: 150, estimatedMinutes: 12 },

      // Chapter 5: Defense in Depth
      { slug: 'hybrid-encryption-ops', chapterId: 5, title: 'Hybrid Encryption: Best of Both Worlds', description: 'Combine asymmetric key exchange with symmetric speed. How TLS really works.', orderIndex: 1, cryptoModule: 'hybrid-encryption', difficulty: 'advanced', xpReward: 200, estimatedMinutes: 15 },
      { slug: 'key-wrapping-ops', chapterId: 5, title: 'Key Wrapping: Protecting Keys with Keys', description: 'Securely wrap data encryption keys with key encryption keys.', orderIndex: 2, cryptoModule: 'key-wrapping', difficulty: 'advanced', xpReward: 200, estimatedMinutes: 12 },
      { slug: 'envelope-encryption-ops', chapterId: 5, title: 'Envelope Encryption: The Cloud Pattern', description: 'The industry standard for encrypting data at scale. Master envelope encryption.', orderIndex: 3, cryptoModule: 'envelope-encryption', difficulty: 'advanced', xpReward: 200, estimatedMinutes: 15 },

      // Chapter 6: Covert Protocols
      { slug: 'commitment-schemes', chapterId: 6, title: 'Commitment: Seal Your Intent', description: 'Commit to a value without revealing it. Essential for fair protocols and auctions.', orderIndex: 1, cryptoModule: 'commitment', difficulty: 'advanced', xpReward: 200, estimatedMinutes: 12 },
      { slug: 'secret-sharing-shamir', chapterId: 6, title: 'Secret Sharing: Distribute Trust', description: 'Shamir\'s Secret Sharing splits secrets into shares. No single point of failure.', orderIndex: 2, cryptoModule: 'secret-sharing', difficulty: 'advanced', xpReward: 200, estimatedMinutes: 15 },
      { slug: 'merkle-trees-verify', chapterId: 6, title: 'Merkle Trees: Efficient Verification', description: 'Merkle trees enable efficient data integrity verification. The backbone of blockchain.', orderIndex: 3, cryptoModule: 'merkle-tree', difficulty: 'advanced', xpReward: 200, estimatedMinutes: 15 },
      { slug: 'blind-signatures-privacy', chapterId: 6, title: 'Blind Signatures: Sign Without Seeing', description: 'Blind signatures allow signing without seeing the message. Essential for digital cash and voting.', orderIndex: 4, cryptoModule: 'blind-signatures', difficulty: 'expert', xpReward: 250, estimatedMinutes: 20 },
      { slug: 'zero-knowledge-proofs', chapterId: 6, title: 'ZKP: Prove Without Revealing', description: 'Zero-knowledge proofs let you prove knowledge without revealing the secret. The pinnacle of privacy.', orderIndex: 5, cryptoModule: 'zkp', difficulty: 'expert', xpReward: 250, estimatedMinutes: 20 },

      // Chapter 7: The Quantum Threat
      { slug: 'post-quantum-crypto', chapterId: 7, title: 'Post-Quantum: The Future of Cryptography', description: 'Quantum computers threaten classical crypto. Master ML-KEM, ML-DSA, and SLH-DSA — the NIST post-quantum standards.', orderIndex: 1, cryptoModule: 'post-quantum', difficulty: 'expert', xpReward: 300, estimatedMinutes: 25 },
    ];

    for (const q of quests) {
      const quest = await this.questModel.create(q);
      await this.seedChallengesForQuest(quest);
    }
  }

  private async seedChallengesForQuest(quest: Quest) {
    const challengesByModule: Record<string, any[]> = {
      'encoding': [
        { orderIndex: 1, type: 'decode', title: 'Decode Base64', instruction: 'Decode the following Base64 string to reveal the hidden message.', narrativeContext: 'An intercepted enemy transmission uses Base64 encoding. Decode it to read the message.', hint: 'Base64 uses A-Z, a-z, 0-9, +, / characters', xpReward: 25, config: { encoding: 'base64', input: 'Q2lwaGVyVmF1bHQ=', xpReward: 25 } },
        { orderIndex: 2, type: 'encode', title: 'Encode to Hex', instruction: 'Convert the text "SECRET" to its hexadecimal representation.', narrativeContext: 'You need to transmit a codename in hex format to avoid detection.', hint: 'Each character becomes 2 hex digits', xpReward: 25, config: { encoding: 'hex', input: 'SECRET', xpReward: 25 } },
        { orderIndex: 3, type: 'multi_choice', title: 'Encoding vs Encryption', instruction: 'What is the key difference between encoding and encryption?', narrativeContext: 'A junior recruit confused encoding with encryption. Correct their understanding.', xpReward: 25, config: { options: ['Encoding requires a key, encryption does not', 'Encryption requires a key, encoding does not', 'They are the same thing', 'Encoding is more secure than encryption'], correctAnswer: 'Encryption requires a key, encoding does not', correctExplanation: 'Correct! Encoding is a reversible transformation (no secret needed), while encryption requires a key for security.', wrongExplanation: 'Encoding is simply a data format transformation (like Base64), while encryption uses a secret key to protect data.', xpReward: 25 } },
      ],
      'random': [
        { orderIndex: 1, type: 'generate', title: 'Generate Random Bytes', instruction: 'Generate 16 bytes of cryptographically secure random data in hex format.', narrativeContext: 'You need a random initialization vector for an encrypted channel.', hint: 'Use crypto.randomBytes or equivalent CSPRNG', xpReward: 25, config: { bytes: 16, xpReward: 25 } },
        { orderIndex: 2, type: 'multi_choice', title: 'CSPRNG vs PRNG', instruction: 'Why must cryptographic applications use a CSPRNG instead of Math.random()?', xpReward: 25, config: { options: ['Math.random() is too slow', 'Math.random() output is predictable and not suitable for security', 'CSPRNG produces larger numbers', 'There is no difference'], correctAnswer: 'Math.random() output is predictable and not suitable for security', correctExplanation: 'Correct! Math.random() uses a predictable PRNG. CSPRNGs use entropy from the OS to produce unpredictable output.', wrongExplanation: 'Math.random() uses a deterministic algorithm that can be predicted. CSPRNGs gather real entropy.', xpReward: 25 } },
      ],
      'hashing': [
        { orderIndex: 1, type: 'generate', title: 'Hash a Message', instruction: 'Compute the SHA-256 hash of the string "CipherVault".', narrativeContext: 'Create a digital fingerprint of our organization\'s codename for verification.', hint: 'SHA-256 produces a 64-character hex string', xpReward: 25, config: { input: 'CipherVault', algorithm: 'sha256', xpReward: 25 } },
        { orderIndex: 2, type: 'multi_choice', title: 'Hash Properties', instruction: 'Which property of cryptographic hash functions means you cannot find the input from the output?', xpReward: 25, config: { options: ['Collision resistance', 'Pre-image resistance', 'Determinism', 'Avalanche effect'], correctAnswer: 'Pre-image resistance', correctExplanation: 'Correct! Pre-image resistance means given a hash h, it\'s computationally infeasible to find any message m such that hash(m) = h.', wrongExplanation: 'Pre-image resistance is the property that prevents finding the original input from a hash output.', xpReward: 25 } },
        { orderIndex: 3, type: 'verify', title: 'Detect Tampering', instruction: 'A message was transmitted with its SHA-256 hash. Has the message been tampered with?', narrativeContext: 'Enemy agents may have modified this transmission. Verify its integrity.', xpReward: 25, config: { message: 'Transfer 1000 credits', hash: 'tampered_hash_value', correctAnswer: 'invalid', xpReward: 25 } },
      ],
      'salts': [
        { orderIndex: 1, type: 'multi_choice', title: 'Why Use Salts?', instruction: 'What is the primary purpose of adding a salt to password hashing?', narrativeContext: 'Our password database was almost compromised. Understanding salts is critical.', xpReward: 25, config: { options: ['Make the password longer', 'Prevent rainbow table attacks and ensure identical passwords have different hashes', 'Encrypt the password', 'Speed up the hashing process'], correctAnswer: 'Prevent rainbow table attacks and ensure identical passwords have different hashes', correctExplanation: 'Correct! Salts ensure that even identical passwords produce different hashes, defeating precomputed rainbow tables.', wrongExplanation: 'Salts are random values added before hashing to ensure identical passwords produce different hashes, defeating rainbow tables.', xpReward: 25 } },
        { orderIndex: 2, type: 'multi_choice', title: 'Salt Best Practices', instruction: 'Which is the best practice for salt generation?', xpReward: 25, config: { options: ['Use the username as salt', 'Use a unique cryptographically random salt per password', 'Use a global salt for all passwords', 'Use a timestamp as salt'], correctAnswer: 'Use a unique cryptographically random salt per password', correctExplanation: 'Correct! Each password should have its own unique, random salt to maximize security.', wrongExplanation: 'Best practice: generate a unique, cryptographically random salt for each password.', xpReward: 25 } },
        { orderIndex: 3, type: 'explain', title: 'Explain Rainbow Tables', instruction: 'Explain what a rainbow table attack is and how salts defend against it.', narrativeContext: 'Brief the new recruits on rainbow table attacks.', xpReward: 25, config: { keywords: ['precomputed', 'hash', 'lookup', 'salt', 'unique'], xpReward: 25 } },
      ],
      'symmetric-encryption': [
        { orderIndex: 1, type: 'multi_choice', title: 'Symmetric vs Asymmetric', instruction: 'What defines symmetric encryption?', xpReward: 25, config: { options: ['Uses two different keys', 'Uses the same key for encryption and decryption', 'Does not use any key', 'Only works with text data'], correctAnswer: 'Uses the same key for encryption and decryption', correctExplanation: 'Correct! Symmetric encryption uses one shared secret key for both encryption and decryption.', wrongExplanation: 'Symmetric encryption uses the same key for both encryption and decryption.', xpReward: 25 } },
        { orderIndex: 2, type: 'encrypt', title: 'Encrypt a Message', instruction: 'Encrypt the plaintext "CLASSIFIED" using AES-GCM.', narrativeContext: 'Secure this classified message before transmission.', xpReward: 25, config: { plaintext: 'CLASSIFIED', xpReward: 25 } },
        { orderIndex: 3, type: 'multi_choice', title: 'Block vs Stream Ciphers', instruction: 'How do block ciphers differ from stream ciphers?', xpReward: 25, config: { options: ['Block ciphers are always faster', 'Block ciphers process fixed-size blocks, stream ciphers process one bit/byte at a time', 'Stream ciphers are more secure', 'There is no difference'], correctAnswer: 'Block ciphers process fixed-size blocks, stream ciphers process one bit/byte at a time', correctExplanation: 'Correct! Block ciphers (like AES) process data in fixed-size blocks, while stream ciphers encrypt data continuously.', wrongExplanation: 'Block ciphers process fixed-size data blocks (e.g., 128 bits for AES), while stream ciphers process data byte by byte.', xpReward: 25 } },
      ],
      'aes-gcm': [
        { orderIndex: 1, type: 'encrypt', title: 'AES-GCM Encryption', instruction: 'Encrypt "TOP SECRET INTEL" using AES-256-GCM. Provide the ciphertext, key, IV, and auth tag.', narrativeContext: 'This intelligence must be encrypted with authenticated encryption before storage.', hint: 'AES-GCM provides both encryption and authentication', xpReward: 25, config: { plaintext: 'TOP SECRET INTEL', xpReward: 25 } },
        { orderIndex: 2, type: 'decrypt', title: 'AES-GCM Decryption', instruction: 'Decrypt the provided AES-GCM ciphertext using the given key, IV, and auth tag.', narrativeContext: 'Intercepted enemy communication. Decrypt it with the recovered key.', xpReward: 25, config: { xpReward: 25, expectedPlaintext: 'RENDEZVOUS AT DAWN' } },
        { orderIndex: 3, type: 'multi_choice', title: 'GCM Auth Tag', instruction: 'What does the authentication tag in AES-GCM protect against?', xpReward: 25, config: { options: ['Brute force attacks', 'Tampering and unauthorized modification of ciphertext', 'Key extraction', 'Replay attacks'], correctAnswer: 'Tampering and unauthorized modification of ciphertext', correctExplanation: 'Correct! The auth tag ensures integrity — any modification to the ciphertext will cause decryption to fail.', wrongExplanation: 'The GCM authentication tag detects any tampering with the ciphertext, ensuring integrity.', xpReward: 25 } },
      ],
      'chacha20': [
        { orderIndex: 1, type: 'encrypt', title: 'ChaCha20-Poly1305 Encryption', instruction: 'Encrypt "STREAM CIPHER DATA" using ChaCha20-Poly1305.', narrativeContext: 'Mobile field agents need ChaCha20 — it\'s faster on devices without AES hardware.', xpReward: 25, config: { plaintext: 'STREAM CIPHER DATA', xpReward: 25 } },
        { orderIndex: 2, type: 'multi_choice', title: 'ChaCha20 Advantages', instruction: 'When is ChaCha20-Poly1305 preferred over AES-GCM?', xpReward: 25, config: { options: ['When you need smaller key sizes', 'On platforms without hardware AES acceleration (mobile, IoT)', 'When encrypting files larger than 1GB', 'When backward compatibility is needed'], correctAnswer: 'On platforms without hardware AES acceleration (mobile, IoT)', correctExplanation: 'Correct! ChaCha20 performs well in software without needing hardware AES-NI instructions.', wrongExplanation: 'ChaCha20 excels on platforms that lack AES hardware acceleration, as it\'s designed for efficient software implementation.', xpReward: 25 } },
      ],
      'hmac': [
        { orderIndex: 1, type: 'generate', title: 'Generate HMAC', instruction: 'Generate an HMAC-SHA256 for the message "Authenticate me" using the key "vault-key-001".', narrativeContext: 'Tag this message so the receiving agent can verify it wasn\'t modified in transit.', xpReward: 25, config: { message: 'Authenticate me', key: 'vault-key-001', algorithm: 'sha256', xpReward: 25 } },
        { orderIndex: 2, type: 'verify', title: 'Verify HMAC', instruction: 'Verify whether the given HMAC is valid for the message.', narrativeContext: 'An incoming message claims to be from HQ. Verify its HMAC.', xpReward: 25, config: { message: 'Mission confirmed', key: 'hq-secret', hmac: 'invalid_hmac_here', algorithm: 'sha256', xpReward: 25 } },
        { orderIndex: 3, type: 'multi_choice', title: 'HMAC vs Hash', instruction: 'Why use HMAC instead of a plain hash for message authentication?', xpReward: 25, config: { options: ['HMAC is faster', 'HMAC includes a secret key, preventing forgery by anyone without the key', 'HMAC produces shorter output', 'Plain hashes are deprecated'], correctAnswer: 'HMAC includes a secret key, preventing forgery by anyone without the key', correctExplanation: 'Correct! Unlike plain hashes, HMAC requires a secret key — only parties with the key can create or verify the tag.', wrongExplanation: 'HMAC uses a secret key combined with the hash, so only key holders can create valid tags.', xpReward: 25 } },
      ],
      'key-pair': [
        { orderIndex: 1, type: 'generate', title: 'Generate RSA Key Pair', instruction: 'Generate an RSA key pair and provide both the public and private keys in PEM format.', narrativeContext: 'Every CipherVault agent needs their own key pair. Generate yours now.', xpReward: 25, config: { xpReward: 25 } },
        { orderIndex: 2, type: 'multi_choice', title: 'Public vs Private Key', instruction: 'Which key should NEVER be shared?', xpReward: 25, config: { options: ['Public key', 'Private key', 'Both keys', 'Neither key'], correctAnswer: 'Private key', correctExplanation: 'Correct! The private key must be kept secret. The public key can be freely distributed.', wrongExplanation: 'The private key must always be kept secret. Only the public key should be shared.', xpReward: 25 } },
      ],
      'asymmetric-encryption': [
        { orderIndex: 1, type: 'multi_choice', title: 'Asymmetric Encryption Flow', instruction: 'To send an encrypted message to Agent B, which key do you use?', xpReward: 25, config: { options: ['Your private key', 'Agent B\'s public key', 'Agent B\'s private key', 'A shared symmetric key'], correctAnswer: 'Agent B\'s public key', correctExplanation: 'Correct! Encrypt with the recipient\'s public key so only their private key can decrypt it.', wrongExplanation: 'You encrypt with the recipient\'s public key. Only their private key can decrypt the message.', xpReward: 25 } },
        { orderIndex: 2, type: 'multi_choice', title: 'RSA Key Size', instruction: 'What is the minimum recommended RSA key size for security today?', xpReward: 25, config: { options: ['512 bits', '1024 bits', '2048 bits', '4096 bits'], correctAnswer: '2048 bits', correctExplanation: 'Correct! 2048-bit RSA is the current minimum recommendation. 4096 bits provides an extra safety margin.', wrongExplanation: '2048-bit RSA keys are the minimum recommended today. Keys smaller than 2048 bits are considered insecure.', xpReward: 25 } },
      ],
      'diffie-hellman': [
        { orderIndex: 1, type: 'generate', title: 'Diffie-Hellman Exchange', instruction: 'Perform a Diffie-Hellman key exchange and provide the shared secret.', narrativeContext: 'Establish a secure channel with a remote agent without pre-shared keys.', xpReward: 25, config: { xpReward: 25 } },
        { orderIndex: 2, type: 'multi_choice', title: 'DH Security', instruction: 'What attack is Diffie-Hellman vulnerable to without authentication?', xpReward: 25, config: { options: ['Brute force', 'Man-in-the-middle', 'SQL injection', 'Buffer overflow'], correctAnswer: 'Man-in-the-middle', correctExplanation: 'Correct! Without authentication, an attacker can intercept and replace keys in a MITM attack.', wrongExplanation: 'Without authentication, DH is vulnerable to man-in-the-middle attacks where the attacker impersonates both parties.', xpReward: 25 } },
      ],
      'ecc': [
        { orderIndex: 1, type: 'sign', title: 'ECC Signature', instruction: 'Sign the message "Agent verified" using ECC (P-256 curve).', narrativeContext: 'Sign your verification message using your elliptic curve keys.', xpReward: 25, config: { message: 'Agent verified', xpReward: 25 } },
        { orderIndex: 2, type: 'multi_choice', title: 'ECC vs RSA', instruction: 'What advantage does ECC have over RSA?', xpReward: 25, config: { options: ['ECC is older and more tested', 'ECC provides equivalent security with much smaller key sizes', 'ECC is easier to implement', 'ECC works without key pairs'], correctAnswer: 'ECC provides equivalent security with much smaller key sizes', correctExplanation: 'Correct! A 256-bit ECC key provides similar security to a 3072-bit RSA key.', wrongExplanation: 'ECC\'s main advantage: a 256-bit ECC key ≈ 3072-bit RSA security, enabling faster operations and smaller keys.', xpReward: 25 } },
      ],
      'key-derivation': [
        { orderIndex: 1, type: 'generate', title: 'Derive a Key with PBKDF2', instruction: 'Derive a key from the password "MySecretPass" with the given salt using PBKDF2.', narrativeContext: 'Convert an agent\'s passphrase into a cryptographic key for secure storage.', xpReward: 25, config: { password: 'MySecretPass', salt: 'a1b2c3d4e5f6a7b8', iterations: 100000, xpReward: 25 } },
        { orderIndex: 2, type: 'multi_choice', title: 'Iteration Count', instruction: 'Why do KDFs use a high iteration count?', xpReward: 25, config: { options: ['To produce longer keys', 'To deliberately slow down computation, making brute force attacks impractical', 'To improve randomness', 'To compress the password'], correctAnswer: 'To deliberately slow down computation, making brute force attacks impractical', correctExplanation: 'Correct! High iteration counts make each guess expensive, protecting against brute force attacks.', wrongExplanation: 'KDFs use many iterations to make password guessing computationally expensive for attackers.', xpReward: 25 } },
      ],
      'hkdf': [
        { orderIndex: 1, type: 'generate', title: 'Derive with HKDF', instruction: 'Use HKDF to derive a 32-byte key from the input material "master-secret" with info "encryption-key".', narrativeContext: 'Derive specialized keys from the master key material for different purposes.', xpReward: 25, config: { ikm: 'master-secret', info: 'encryption-key', keyLength: 32, xpReward: 25 } },
        { orderIndex: 2, type: 'multi_choice', title: 'HKDF vs PBKDF2', instruction: 'When should you use HKDF instead of PBKDF2?', xpReward: 25, config: { options: ['For password hashing', 'For deriving multiple keys from already-strong key material', 'For storing passwords', 'For generating random numbers'], correctAnswer: 'For deriving multiple keys from already-strong key material', correctExplanation: 'Correct! HKDF is for deriving keys from strong input material. Use PBKDF2/scrypt for passwords.', wrongExplanation: 'HKDF is designed for deriving keys from already-strong key material (not passwords). Use PBKDF2 for passwords.', xpReward: 25 } },
      ],
      'digital-signatures': [
        { orderIndex: 1, type: 'sign', title: 'Sign a Document', instruction: 'Digitally sign the message "I authorize this transaction" and provide the signature.', narrativeContext: 'Authorize a critical fund transfer with your digital signature.', xpReward: 25, config: { message: 'I authorize this transaction', xpReward: 25 } },
        { orderIndex: 2, type: 'verify', title: 'Verify a Signature', instruction: 'Verify whether the provided signature is valid for the given message and public key.', narrativeContext: 'A signed order was received. Verify its authenticity before executing.', xpReward: 25, config: { message: 'Execute operation alpha', signature: 'test', publicKey: 'test', correctAnswer: 'valid', xpReward: 25 } },
        { orderIndex: 3, type: 'multi_choice', title: 'Non-Repudiation', instruction: 'What property do digital signatures provide that HMAC does not?', xpReward: 25, config: { options: ['Speed', 'Non-repudiation — the signer cannot deny signing', 'Compression', 'Encryption'], correctAnswer: 'Non-repudiation — the signer cannot deny signing', correctExplanation: 'Correct! Since only the signer\'s private key can create the signature, they cannot deny authorship.', wrongExplanation: 'Digital signatures provide non-repudiation: since only the private key holder can sign, they cannot deny it.', xpReward: 25 } },
      ],
      'jwt': [
        { orderIndex: 1, type: 'decode', title: 'Decode a JWT', instruction: 'Decode the provided JWT and extract the payload claims.', narrativeContext: 'An agent\'s session token was intercepted. Extract the claims without verification.', xpReward: 25, config: { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZ2VudC0wMDEiLCJyb2xlIjoib3BlcmF0aXZlIiwiaWF0IjoxNjE2MjM5MDIyfQ.placeholder', xpReward: 25 } },
        { orderIndex: 2, type: 'generate', title: 'Create a JWT', instruction: 'Create an HS256 JWT with payload {"agent":"007","clearance":"top-secret"} using secret "vault-jwt-secret".', narrativeContext: 'Issue a new authentication token for a field agent.', xpReward: 25, config: { secret: 'vault-jwt-secret', xpReward: 25 } },
        { orderIndex: 3, type: 'multi_choice', title: 'JWT Security', instruction: 'Why is the "none" algorithm in JWT considered dangerous?', xpReward: 25, config: { options: ['It makes tokens expire faster', 'It allows token forgery without any key verification', 'It uses weak encryption', 'It increases token size'], correctAnswer: 'It allows token forgery without any key verification', correctExplanation: 'Correct! The "none" algorithm bypasses signature verification entirely, allowing anyone to forge tokens.', wrongExplanation: 'The "none" algorithm disables signature verification, allowing attackers to create valid tokens without keys.', xpReward: 25 } },
      ],
      'certificates': [
        { orderIndex: 1, type: 'generate', title: 'Create Self-Signed Certificate', instruction: 'Create a self-signed X.509 certificate for "agent.ciphervault.io".', narrativeContext: 'Set up a secure channel endpoint with a self-signed certificate.', xpReward: 25, config: { subject: 'agent.ciphervault.io', xpReward: 25 } },
        { orderIndex: 2, type: 'multi_choice', title: 'Certificate Chain', instruction: 'What is the role of a Certificate Authority (CA)?', xpReward: 25, config: { options: ['To encrypt data', 'To vouch for the binding between a public key and an identity', 'To generate private keys', 'To store passwords'], correctAnswer: 'To vouch for the binding between a public key and an identity', correctExplanation: 'Correct! CAs verify and certify that a public key belongs to the claimed identity.', wrongExplanation: 'A CA verifies identities and issues certificates that bind public keys to those identities.', xpReward: 25 } },
      ],
      'otp': [
        { orderIndex: 1, type: 'generate', title: 'Generate HOTP', instruction: 'Generate an HOTP code using the provided secret and counter value.', narrativeContext: 'Generate a one-time code for secure facility access.', xpReward: 25, config: { secret: 'a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b8a1b2c3d4', counter: 1, xpReward: 25 } },
        { orderIndex: 2, type: 'multi_choice', title: 'HOTP vs TOTP', instruction: 'How does TOTP differ from HOTP?', xpReward: 25, config: { options: ['TOTP uses a time-based counter instead of an event counter', 'TOTP is less secure', 'TOTP doesn\'t require a shared secret', 'TOTP produces longer codes'], correctAnswer: 'TOTP uses a time-based counter instead of an event counter', correctExplanation: 'Correct! TOTP uses the current time as the counter, so codes expire after a time window (typically 30 seconds).', wrongExplanation: 'TOTP uses time as the counter, making codes valid only for a short window (usually 30 seconds).', xpReward: 25 } },
      ],
      'hybrid-encryption': [
        { orderIndex: 1, type: 'encrypt', title: 'Hybrid Encryption', instruction: 'Encrypt "ULTRA CLASSIFIED" using hybrid encryption (RSA + AES-GCM).', narrativeContext: 'Combine the best of both worlds — asymmetric key exchange with symmetric speed.', xpReward: 25, config: { plaintext: 'ULTRA CLASSIFIED', xpReward: 25 } },
        { orderIndex: 2, type: 'multi_choice', title: 'Why Hybrid?', instruction: 'Why is hybrid encryption used instead of pure asymmetric encryption?', xpReward: 25, config: { options: ['Asymmetric is too slow for large data; hybrid uses asymmetric for key exchange and symmetric for data', 'Symmetric encryption is broken', 'Asymmetric keys are easier to manage', 'Hybrid encryption uses no keys'], correctAnswer: 'Asymmetric is too slow for large data; hybrid uses asymmetric for key exchange and symmetric for data', correctExplanation: 'Correct! RSA can only encrypt small data. Hybrid uses RSA to exchange a symmetric key, then AES for the actual data.', wrongExplanation: 'RSA is slow and limited in data size. Hybrid encryption uses RSA for key exchange and AES for bulk data encryption.', xpReward: 25 } },
      ],
      'key-wrapping': [
        { orderIndex: 1, type: 'generate', title: 'Wrap a Data Key', instruction: 'Generate a data key and wrap it using a Key Encryption Key (KEK).', narrativeContext: 'Protect the data encryption key by wrapping it with the master key.', xpReward: 25, config: { xpReward: 25 } },
        { orderIndex: 2, type: 'multi_choice', title: 'Key Hierarchy', instruction: 'What is the purpose of key wrapping in a key hierarchy?', xpReward: 25, config: { options: ['To make keys shorter', 'To protect data keys by encrypting them with a higher-level key', 'To convert symmetric keys to asymmetric', 'To hash the key'], correctAnswer: 'To protect data keys by encrypting them with a higher-level key', correctExplanation: 'Correct! Key wrapping encrypts data keys with a KEK, enabling secure key storage and rotation.', wrongExplanation: 'Key wrapping encrypts data keys with a Key Encryption Key (KEK), creating a secure key hierarchy.', xpReward: 25 } },
      ],
      'envelope-encryption': [
        { orderIndex: 1, type: 'encrypt', title: 'Envelope Encryption', instruction: 'Encrypt "VAULT DATA PAYLOAD" using envelope encryption with a master key.', narrativeContext: 'Secure our vault\'s data using the cloud-standard envelope encryption pattern.', xpReward: 25, config: { plaintext: 'VAULT DATA PAYLOAD', xpReward: 25 } },
        { orderIndex: 2, type: 'multi_choice', title: 'Envelope Pattern', instruction: 'What is the main benefit of envelope encryption?', xpReward: 25, config: { options: ['Faster encryption', 'The master key never directly touches the data, enabling key rotation without re-encrypting data', 'Smaller ciphertext', 'No keys needed'], correctAnswer: 'The master key never directly touches the data, enabling key rotation without re-encrypting data', correctExplanation: 'Correct! Only the data key needs re-wrapping during key rotation — the data itself stays encrypted.', wrongExplanation: 'Envelope encryption separates the master key from data. Key rotation only re-wraps the data key.', xpReward: 25 } },
      ],
      'commitment': [
        { orderIndex: 1, type: 'generate', title: 'Create a Commitment', instruction: 'Commit to the value "ALPHA" using a cryptographic commitment scheme.', narrativeContext: 'Seal your vote before the results are revealed — no changing your mind.', xpReward: 25, config: { value: 'ALPHA', xpReward: 25 } },
        { orderIndex: 2, type: 'verify', title: 'Verify a Commitment', instruction: 'Verify whether the commitment matches the revealed value and nonce.', xpReward: 25, config: { value: 'BRAVO', nonce: 'test', commitment: 'test', correctAnswer: 'valid', xpReward: 25 } },
        { orderIndex: 3, type: 'multi_choice', title: 'Commitment Properties', instruction: 'What two properties must a commitment scheme have?', xpReward: 25, config: { options: ['Speed and size', 'Hiding (conceals the value) and Binding (cannot change the value after committing)', 'Encryption and decryption', 'Signing and verification'], correctAnswer: 'Hiding (conceals the value) and Binding (cannot change the value after committing)', correctExplanation: 'Correct! Hiding: the commitment reveals nothing. Binding: you cannot open it to a different value.', wrongExplanation: 'Commitment schemes must be Hiding (conceals value) and Binding (can\'t change committed value).', xpReward: 25 } },
      ],
      'secret-sharing': [
        { orderIndex: 1, type: 'generate', title: 'Split a Secret', instruction: 'Split the secret "NUCLEAR LAUNCH CODES" into 5 shares with a threshold of 3.', narrativeContext: 'No single agent should hold all the launch codes. Split them among the team.', xpReward: 25, config: { secret: 'NUCLEAR LAUNCH CODES', totalShares: 5, threshold: 3, xpReward: 25 } },
        { orderIndex: 2, type: 'multi_choice', title: 'Threshold Schemes', instruction: 'In a (3,5) secret sharing scheme, how many shares are needed to reconstruct the secret?', xpReward: 25, config: { options: ['1', '2', '3', '5'], correctAnswer: '3', correctExplanation: 'Correct! In a (k,n) scheme, k shares are needed. Any fewer reveals nothing about the secret.', wrongExplanation: 'In a (3,5) scheme, exactly 3 of the 5 shares are needed. Fewer than 3 reveals zero information.', xpReward: 25 } },
      ],
      'merkle-tree': [
        { orderIndex: 1, type: 'generate', title: 'Build a Merkle Tree', instruction: 'Build a Merkle tree from the leaves ["alpha", "bravo", "charlie", "delta"] and compute the root hash.', narrativeContext: 'Build a tamper-evident log of all agent communications.', xpReward: 25, config: { leaves: ['alpha', 'bravo', 'charlie', 'delta'], xpReward: 25 } },
        { orderIndex: 2, type: 'multi_choice', title: 'Merkle Proofs', instruction: 'What is the time complexity of verifying a single element in a Merkle tree?', xpReward: 25, config: { options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctAnswer: 'O(log n)', correctExplanation: 'Correct! Merkle proofs require only O(log n) hashes — you only need the sibling hashes along the path to the root.', wrongExplanation: 'Merkle proofs are O(log n) — only hashes along the path from leaf to root are needed.', xpReward: 25 } },
      ],
      'blind-signatures': [
        { orderIndex: 1, type: 'multi_step', title: 'Blind Signature Protocol', instruction: 'Execute the blind signature protocol: blind the message, have it signed, then unblind.', narrativeContext: 'Cast an anonymous but verifiable vote using blind signatures.', xpReward: 25, config: { step: 'blind', message: 'My secret vote', xpReward: 25 } },
        { orderIndex: 2, type: 'multi_choice', title: 'Blind Signature Use Cases', instruction: 'What is the primary use case for blind signatures?', xpReward: 25, config: { options: ['File encryption', 'Anonymous but verifiable transactions (e-cash, voting)', 'Password hashing', 'Key exchange'], correctAnswer: 'Anonymous but verifiable transactions (e-cash, voting)', correctExplanation: 'Correct! Blind signatures enable the signer to sign without seeing the content — perfect for anonymous voting and digital cash.', wrongExplanation: 'Blind signatures allow signing messages without seeing them, enabling anonymous voting and e-cash.', xpReward: 25 } },
      ],
      'zkp': [
        { orderIndex: 1, type: 'multi_step', title: 'Zero-Knowledge Proof', instruction: 'Execute a ZKP protocol: generate commitment, receive challenge, compute response.', narrativeContext: 'Prove you know the secret without revealing it — the ultimate cryptographic feat.', xpReward: 25, config: { step: 'commit', xpReward: 25 } },
        { orderIndex: 2, type: 'multi_choice', title: 'ZKP Properties', instruction: 'Which is NOT a property of zero-knowledge proofs?', xpReward: 25, config: { options: ['Completeness', 'Soundness', 'Zero-knowledge', 'Reversibility'], correctAnswer: 'Reversibility', correctExplanation: 'Correct! ZKPs have three properties: Completeness, Soundness, and Zero-knowledge. Reversibility is not one.', wrongExplanation: 'ZKP properties: Completeness (honest prover convinces), Soundness (can\'t fake it), Zero-knowledge (reveals nothing).', xpReward: 25 } },
        { orderIndex: 3, type: 'multi_choice', title: 'ZKP Applications', instruction: 'Which technology heavily relies on zero-knowledge proofs?', xpReward: 25, config: { options: ['Email encryption', 'Privacy-preserving blockchains (e.g., Zcash, zk-rollups)', 'HTTP/2', 'DNS resolution'], correctAnswer: 'Privacy-preserving blockchains (e.g., Zcash, zk-rollups)', correctExplanation: 'Correct! ZKPs power privacy coins like Zcash and scalability solutions like zk-rollups on Ethereum.', wrongExplanation: 'ZKPs are used in privacy blockchains (Zcash) and zk-rollups for scalability.', xpReward: 25 } },
      ],
      'post-quantum': [
        { orderIndex: 1, type: 'generate', title: 'ML-KEM Key Generation', instruction: 'Generate an ML-KEM (Kyber) key pair for post-quantum key encapsulation.', narrativeContext: 'The Quantum Threat is real. Generate quantum-resistant keys to protect the future.', xpReward: 25, config: { algorithm: 'ml-kem', variant: '768', xpReward: 25 } },
        { orderIndex: 2, type: 'generate', title: 'ML-DSA Signature', instruction: 'Generate ML-DSA (Dilithium) keys and sign the message "Quantum-safe transmission".', narrativeContext: 'Sign this critical message with quantum-resistant signatures.', xpReward: 25, config: { algorithm: 'ml-dsa', message: 'Quantum-safe transmission', variant: '65', xpReward: 25 } },
        { orderIndex: 3, type: 'multi_choice', title: 'Why Post-Quantum?', instruction: 'Why is post-quantum cryptography needed?', xpReward: 25, config: { options: ['Current encryption is too slow', 'Quantum computers can break RSA and ECC using Shor\'s algorithm', 'Post-quantum algorithms are simpler', 'Classical computers are becoming obsolete'], correctAnswer: 'Quantum computers can break RSA and ECC using Shor\'s algorithm', correctExplanation: 'Correct! Shor\'s algorithm can factor large numbers and compute discrete logs in polynomial time, breaking RSA and ECC.', wrongExplanation: 'Quantum computers running Shor\'s algorithm can break RSA and ECC. Post-quantum algorithms resist this.', xpReward: 25 } },
        { orderIndex: 4, type: 'multi_choice', title: 'NIST PQC Standards', instruction: 'Which of these is a NIST-standardized post-quantum algorithm?', xpReward: 25, config: { options: ['RSA-4096', 'ML-KEM (CRYSTALS-Kyber)', 'AES-512', 'SHA-3'], correctAnswer: 'ML-KEM (CRYSTALS-Kyber)', correctExplanation: 'Correct! ML-KEM (formerly CRYSTALS-Kyber) is NIST\'s standardized post-quantum key encapsulation mechanism.', wrongExplanation: 'ML-KEM (CRYSTALS-Kyber) is the NIST standard for post-quantum key encapsulation.', xpReward: 25 } },
      ],
    };

    const challenges = challengesByModule[quest.cryptoModule] || [];
    for (const ch of challenges) {
      await this.challengeModel.create({ ...ch, questId: quest.id });
    }
  }

  private async seedAchievements() {
    const achievements = [
      { slug: 'first-quest', title: 'First Steps', description: 'Complete your first quest', category: 'special', xpBonus: 50, condition: { type: 'quests_completed', count: 1 } },
      { slug: 'five-quests', title: 'Getting Serious', description: 'Complete 5 quests', category: 'skill', xpBonus: 100, condition: { type: 'quests_completed', count: 5 } },
      { slug: 'ten-quests', title: 'Crypto Enthusiast', description: 'Complete 10 quests', category: 'skill', xpBonus: 200, condition: { type: 'quests_completed', count: 10 } },
      { slug: 'all-quests', title: 'Master Cryptographer', description: 'Complete all 26 quests', category: 'special', xpBonus: 1000, condition: { type: 'quests_completed', count: 26 } },
      { slug: 'ch1-complete', title: 'Foundation Laid', description: 'Complete Chapter 1', category: 'chapter', xpBonus: 100, condition: { type: 'chapter_completed', chapter: 1 } },
      { slug: 'ch2-complete', title: 'Vault Secured', description: 'Complete Chapter 2', category: 'chapter', xpBonus: 150, condition: { type: 'chapter_completed', chapter: 2 } },
      { slug: 'ch3-complete', title: 'Trust Established', description: 'Complete Chapter 3', category: 'chapter', xpBonus: 200, condition: { type: 'chapter_completed', chapter: 3 } },
      { slug: 'ch4-complete', title: 'Fully Authenticated', description: 'Complete Chapter 4', category: 'chapter', xpBonus: 200, condition: { type: 'chapter_completed', chapter: 4 } },
      { slug: 'ch5-complete', title: 'Layered Defense', description: 'Complete Chapter 5', category: 'chapter', xpBonus: 250, condition: { type: 'chapter_completed', chapter: 5 } },
      { slug: 'ch6-complete', title: 'Covert Expert', description: 'Complete Chapter 6', category: 'chapter', xpBonus: 300, condition: { type: 'chapter_completed', chapter: 6 } },
      { slug: 'ch7-complete', title: 'Quantum Ready', description: 'Complete Chapter 7', category: 'chapter', xpBonus: 500, condition: { type: 'chapter_completed', chapter: 7 } },
      { slug: 'streak-7', title: 'Weekly Warrior', description: '7-day activity streak', category: 'streak', xpBonus: 100, condition: { type: 'streak_days', days: 7 } },
      { slug: 'streak-30', title: 'Monthly Dedication', description: '30-day activity streak', category: 'streak', xpBonus: 300, condition: { type: 'streak_days', days: 30 } },
      { slug: 'streak-100', title: 'Centurion', description: '100-day activity streak', category: 'streak', xpBonus: 1000, condition: { type: 'streak_days', days: 100 } },
      { slug: 'xp-1000', title: 'Rising Star', description: 'Earn 1000 XP', category: 'skill', xpBonus: 50, condition: { type: 'xp_total', xp: 1000 } },
      { slug: 'xp-5000', title: 'Crypto Veteran', description: 'Earn 5000 XP', category: 'skill', xpBonus: 200, condition: { type: 'xp_total', xp: 5000 } },
      { slug: 'level-10', title: 'Double Digits', description: 'Reach level 10', category: 'skill', xpBonus: 100, condition: { type: 'level_reached', level: 10 } },
      { slug: 'level-25', title: 'Elite Agent', description: 'Reach level 25', category: 'special', xpBonus: 500, condition: { type: 'level_reached', level: 25 } },
    ];

    for (const a of achievements) {
      await this.achievementModel.create(a);
    }
  }
}
