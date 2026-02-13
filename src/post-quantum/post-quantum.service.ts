import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

// Prevents TypeScript from converting import() to require()
const dynamicImport = new Function('specifier', 'return import(specifier)');

@Injectable()
export class PostQuantumService implements OnModuleInit {
  private readonly logger = new Logger(PostQuantumService.name);

  private KEM_VARIANTS: Record<string, any>;
  private DSA_VARIANTS: Record<string, any>;
  private SLH_VARIANTS: Record<string, any>;

  private ml_kem768: any;
  private ml_dsa65: any;
  private slh_dsa_shake_128f: any;

  async onModuleInit() {
    try {
      const [kem, dsa, slh] = await Promise.all([
        dynamicImport('@noble/post-quantum/ml-kem.js'),
        dynamicImport('@noble/post-quantum/ml-dsa.js'),
        dynamicImport('@noble/post-quantum/slh-dsa.js'),
      ]);

      this.KEM_VARIANTS = {
        '512': kem.ml_kem512,
        '768': kem.ml_kem768,
        '1024': kem.ml_kem1024,
      };
      this.DSA_VARIANTS = {
        '44': dsa.ml_dsa44,
        '65': dsa.ml_dsa65,
        '87': dsa.ml_dsa87,
      };
      this.SLH_VARIANTS = {
        '128f': slh.slh_dsa_shake_128f,
        '192f': slh.slh_dsa_shake_192f,
        '256f': slh.slh_dsa_shake_256f,
      };

      this.ml_kem768 = kem.ml_kem768;
      this.ml_dsa65 = dsa.ml_dsa65;
      this.slh_dsa_shake_128f = slh.slh_dsa_shake_128f;
    } catch (err) {
      this.logger.warn(
        'Post-quantum modules could not be loaded (expected in test environments)',
      );
    }
  }

  // ── ML-KEM (Key Encapsulation) ──

  kemKeygen(variant = '768') {
    const kem = this.KEM_VARIANTS[variant];
    if (!kem) throw new Error(`Unknown ML-KEM variant: ${variant}`);

    const { publicKey, secretKey } = kem.keygen();
    return {
      publicKey: Buffer.from(publicKey).toString('hex'),
      secretKey: Buffer.from(secretKey).toString('hex'),
      variant: `ML-KEM-${variant}`,
    };
  }

  kemEncapsulate(publicKeyHex: string, variant = '768') {
    const kem = this.KEM_VARIANTS[variant];
    if (!kem) throw new Error(`Unknown ML-KEM variant: ${variant}`);

    const publicKey = new Uint8Array(Buffer.from(publicKeyHex, 'hex'));
    const { cipherText, sharedSecret } = kem.encapsulate(publicKey);
    return {
      cipherText: Buffer.from(cipherText).toString('hex'),
      sharedSecret: Buffer.from(sharedSecret).toString('hex'),
      variant: `ML-KEM-${variant}`,
    };
  }

  kemDecapsulate(cipherTextHex: string, secretKeyHex: string, variant = '768') {
    const kem = this.KEM_VARIANTS[variant];
    if (!kem) throw new Error(`Unknown ML-KEM variant: ${variant}`);

    const cipherText = new Uint8Array(Buffer.from(cipherTextHex, 'hex'));
    const secretKey = new Uint8Array(Buffer.from(secretKeyHex, 'hex'));
    const sharedSecret = kem.decapsulate(cipherText, secretKey);
    return {
      sharedSecret: Buffer.from(sharedSecret).toString('hex'),
      variant: `ML-KEM-${variant}`,
    };
  }

  demonstrateKem() {
    const variant = '768';
    const { publicKey, secretKey } = this.ml_kem768.keygen();

    const { cipherText, sharedSecret: aliceSecret } =
      this.ml_kem768.encapsulate(publicKey);
    const bobSecret = this.ml_kem768.decapsulate(cipherText, secretKey);

    const secretsMatch =
      Buffer.from(aliceSecret).toString('hex') ===
      Buffer.from(bobSecret).toString('hex');

    return {
      variant: `ML-KEM-${variant}`,
      publicKey: Buffer.from(publicKey).toString('hex'),
      cipherText: Buffer.from(cipherText).toString('hex'),
      aliceSharedSecret: Buffer.from(aliceSecret).toString('hex'),
      bobSharedSecret: Buffer.from(bobSecret).toString('hex'),
      secretsMatch,
      demonstration:
        'ML-KEM enables quantum-resistant key exchange. Alice encapsulates a shared secret using Bob\'s public key; Bob decapsulates with his secret key.',
    };
  }

  // ── ML-DSA (Digital Signatures) ──

  dsaKeygen(variant = '65') {
    const dsa = this.DSA_VARIANTS[variant];
    if (!dsa) throw new Error(`Unknown ML-DSA variant: ${variant}`);

    const { publicKey, secretKey } = dsa.keygen();
    return {
      publicKey: Buffer.from(publicKey).toString('hex'),
      secretKey: Buffer.from(secretKey).toString('hex'),
      variant: `ML-DSA-${variant}`,
    };
  }

  dsaSign(message: string, secretKeyHex: string, variant = '65') {
    const dsa = this.DSA_VARIANTS[variant];
    if (!dsa) throw new Error(`Unknown ML-DSA variant: ${variant}`);

    const msgBytes = new Uint8Array(Buffer.from(message));
    const secretKey = new Uint8Array(Buffer.from(secretKeyHex, 'hex'));
    const signature = dsa.sign(msgBytes, secretKey);
    return {
      signature: Buffer.from(signature).toString('hex'),
      message,
      variant: `ML-DSA-${variant}`,
    };
  }

  dsaVerify(
    signatureHex: string,
    message: string,
    publicKeyHex: string,
    variant = '65',
  ) {
    const dsa = this.DSA_VARIANTS[variant];
    if (!dsa) throw new Error(`Unknown ML-DSA variant: ${variant}`);

    const signature = new Uint8Array(Buffer.from(signatureHex, 'hex'));
    const msgBytes = new Uint8Array(Buffer.from(message));
    const publicKey = new Uint8Array(Buffer.from(publicKeyHex, 'hex'));
    const isValid = dsa.verify(signature, msgBytes, publicKey);
    return {
      isValid,
      message,
      variant: `ML-DSA-${variant}`,
    };
  }

  demonstrateDsa() {
    const variant = '65';
    const { publicKey, secretKey } = this.ml_dsa65.keygen();

    const message = 'Post-quantum digital signature demonstration';
    const msgBytes = new Uint8Array(Buffer.from(message));
    const signature = this.ml_dsa65.sign(msgBytes, secretKey);
    const isValid = this.ml_dsa65.verify(signature, msgBytes, publicKey);

    const tamperedMessage = 'This message has been tampered with';
    const tamperedBytes = new Uint8Array(Buffer.from(tamperedMessage));
    const isTamperedValid = this.ml_dsa65.verify(signature, tamperedBytes, publicKey);

    return {
      variant: `ML-DSA-${variant}`,
      message,
      signature: Buffer.from(signature).toString('hex'),
      isValid,
      tamperedMessage,
      isTamperedValid,
      publicKey: Buffer.from(publicKey).toString('hex'),
      demonstration:
        'ML-DSA provides quantum-resistant digital signatures, replacing RSA/ECDSA for authentication and integrity.',
    };
  }

  // ── SLH-DSA (Hash-Based Signatures) ──

  slhKeygen(variant = '128f') {
    const slh = this.SLH_VARIANTS[variant];
    if (!slh) throw new Error(`Unknown SLH-DSA variant: ${variant}`);

    const { publicKey, secretKey } = slh.keygen();
    return {
      publicKey: Buffer.from(publicKey).toString('hex'),
      secretKey: Buffer.from(secretKey).toString('hex'),
      variant: `SLH-DSA-SHAKE-${variant}`,
    };
  }

  slhSign(message: string, secretKeyHex: string, variant = '128f') {
    const slh = this.SLH_VARIANTS[variant];
    if (!slh) throw new Error(`Unknown SLH-DSA variant: ${variant}`);

    const msgBytes = new Uint8Array(Buffer.from(message));
    const secretKey = new Uint8Array(Buffer.from(secretKeyHex, 'hex'));
    const signature = slh.sign(msgBytes, secretKey);
    return {
      signature: Buffer.from(signature).toString('hex'),
      message,
      variant: `SLH-DSA-SHAKE-${variant}`,
    };
  }

  slhVerify(
    signatureHex: string,
    message: string,
    publicKeyHex: string,
    variant = '128f',
  ) {
    const slh = this.SLH_VARIANTS[variant];
    if (!slh) throw new Error(`Unknown SLH-DSA variant: ${variant}`);

    const signature = new Uint8Array(Buffer.from(signatureHex, 'hex'));
    const msgBytes = new Uint8Array(Buffer.from(message));
    const publicKey = new Uint8Array(Buffer.from(publicKeyHex, 'hex'));
    const isValid = slh.verify(signature, msgBytes, publicKey);
    return {
      isValid,
      message,
      variant: `SLH-DSA-SHAKE-${variant}`,
    };
  }

  demonstrateSlh() {
    const variant = '128f';
    const { publicKey, secretKey } = this.slh_dsa_shake_128f.keygen();

    const message = 'Hash-based post-quantum signature demonstration';
    const msgBytes = new Uint8Array(Buffer.from(message));
    const signature = this.slh_dsa_shake_128f.sign(msgBytes, secretKey);
    const isValid = this.slh_dsa_shake_128f.verify(signature, msgBytes, publicKey);

    const tamperedMessage = 'This message has been tampered with';
    const tamperedBytes = new Uint8Array(Buffer.from(tamperedMessage));
    const isTamperedValid = this.slh_dsa_shake_128f.verify(
      signature,
      tamperedBytes,
      publicKey,
    );

    return {
      variant: `SLH-DSA-SHAKE-${variant}`,
      message,
      signature: Buffer.from(signature).toString('hex'),
      isValid,
      tamperedMessage,
      isTamperedValid,
      publicKey: Buffer.from(publicKey).toString('hex'),
      demonstration:
        'SLH-DSA provides conservative hash-based quantum-resistant signatures built on well-understood primitives.',
    };
  }
}
