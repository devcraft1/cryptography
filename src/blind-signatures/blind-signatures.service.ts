import { BadRequestException, Injectable } from '@nestjs/common';
import { generateKeyPairSync, createHash, randomBytes } from 'crypto';

@Injectable()
export class BlindSignaturesService {
  /**
   * Modular exponentiation: (base^exp) mod mod
   * Uses square-and-multiply algorithm for efficiency.
   */
  // WARNING: Not constant-time. For educational purposes only — vulnerable to timing side-channel attacks.
  private modPow(base: bigint, exp: bigint, mod: bigint): bigint {
    if (mod === BigInt(1)) return BigInt(0);
    let result = BigInt(1);
    base = ((base % mod) + mod) % mod;
    while (exp > BigInt(0)) {
      if (exp % BigInt(2) === BigInt(1)) {
        result = (result * base) % mod;
      }
      exp = exp / BigInt(2);
      base = (base * base) % mod;
    }
    return result;
  }

  /**
   * Modular inverse using the extended Euclidean algorithm.
   * Returns a^(-1) mod m such that (a * a^(-1)) mod m === 1.
   */
  private modInverse(a: bigint, m: bigint): bigint {
    a = ((a % m) + m) % m;
    let [old_r, r] = [a, m];
    let [old_s, s] = [BigInt(1), BigInt(0)];

    while (r !== BigInt(0)) {
      const quotient = old_r / r;
      [old_r, r] = [r, old_r - quotient * r];
      [old_s, s] = [s, old_s - quotient * s];
    }

    if (old_r !== BigInt(1)) {
      throw new BadRequestException('Modular inverse does not exist');
    }

    return ((old_s % m) + m) % m;
  }

  /**
   * Convert a Buffer to a BigInt.
   */
  private bufferToBigInt(buf: Buffer): bigint {
    const hex = buf.toString('hex');
    if (hex.length === 0) return BigInt(0);
    return BigInt('0x' + hex);
  }

  /**
   * Convert a BigInt to a hex string (without 0x prefix).
   */
  private bigIntToHex(n: bigint): string {
    const hex = n.toString(16);
    return hex.length % 2 === 0 ? hex : '0' + hex;
  }

  /**
   * Convert a hex string (without 0x prefix) to BigInt.
   */
  private hexToBigInt(hex: string): bigint {
    return BigInt('0x' + hex);
  }

  /**
   * Compute GCD of two BigInts.
   */
  private gcd(a: bigint, b: bigint): bigint {
    a = a < BigInt(0) ? -a : a;
    b = b < BigInt(0) ? -b : b;
    while (b !== BigInt(0)) {
      [a, b] = [b, a % b];
    }
    return a;
  }

  /**
   * Generate RSA keys for blind signature operations.
   * Uses a 2048-bit key size for adequate security.
   * Extracts n, e, d components from JWK export.
   */
  generateKeys(bits = 2048) {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: bits,
    });

    const pubJwk = publicKey.export({ format: 'jwk' });
    const privJwk = privateKey.export({ format: 'jwk' });

    const n = BigInt(
      '0x' + Buffer.from(pubJwk.n as string, 'base64url').toString('hex'),
    );
    const e = BigInt(
      '0x' + Buffer.from(pubJwk.e as string, 'base64url').toString('hex'),
    );
    const d = BigInt(
      '0x' + Buffer.from(privJwk.d as string, 'base64url').toString('hex'),
    );

    return {
      publicKeyN: this.bigIntToHex(n),
      publicKeyE: this.bigIntToHex(e),
      privateKeyD: this.bigIntToHex(d),
    };
  }

  /**
   * Blind a message using the requester's random blinding factor.
   *
   * Protocol step:
   *   1. Hash the message with SHA-256 to get m
   *   2. Generate random blinding factor r (coprime with n)
   *   3. Compute blindedMessage = (m * r^e) mod n
   */
  blind(message: string, publicKeyN: string, publicKeyE: string) {
    const n = this.hexToBigInt(publicKeyN);
    const e = this.hexToBigInt(publicKeyE);

    // Hash the message with SHA-256
    const hash = createHash('sha256').update(message).digest();
    const m = this.bufferToBigInt(hash) % n;

    // Generate random blinding factor r that is coprime with n
    let r: bigint;
    do {
      const rBytes = randomBytes(Math.ceil(n.toString(16).length / 2));
      r = this.bufferToBigInt(rBytes) % n;
    } while (r <= BigInt(1) || this.gcd(r, n) !== BigInt(1));

    // Compute blinded message: (m * r^e) mod n
    const rToE = this.modPow(r, e, n);
    const blindedMessage = (m * rToE) % n;

    return {
      blindedMessage: this.bigIntToHex(blindedMessage),
      blindingFactor: this.bigIntToHex(r),
      messageHash: this.bigIntToHex(m),
    };
  }

  /**
   * Signer signs the blinded message.
   *
   * Protocol step:
   *   blindedSignature = blindedMessage^d mod n
   */
  signBlinded(blindedMessage: string, privateKeyD: string, publicKeyN: string) {
    const bm = this.hexToBigInt(blindedMessage);
    const d = this.hexToBigInt(privateKeyD);
    const n = this.hexToBigInt(publicKeyN);

    const blindedSignature = this.modPow(bm, d, n);

    return {
      blindedSignature: this.bigIntToHex(blindedSignature),
    };
  }

  /**
   * Requester unblinds the signature.
   *
   * Protocol step:
   *   signature = (blindedSignature * r^(-1)) mod n
   */
  unblind(
    blindedSignature: string,
    blindingFactor: string,
    publicKeyN: string,
  ) {
    const bs = this.hexToBigInt(blindedSignature);
    const r = this.hexToBigInt(blindingFactor);
    const n = this.hexToBigInt(publicKeyN);

    const rInv = this.modInverse(r, n);
    const signature = (bs * rInv) % n;

    return {
      signature: this.bigIntToHex(signature),
    };
  }

  /**
   * Verify a blind signature.
   *
   * Protocol step:
   *   1. Hash message with SHA-256 to get m
   *   2. Compute check = signature^e mod n
   *   3. Verify check === m
   */
  verify(
    message: string,
    signature: string,
    publicKeyN: string,
    publicKeyE: string,
  ) {
    const s = this.hexToBigInt(signature);
    const n = this.hexToBigInt(publicKeyN);
    const e = this.hexToBigInt(publicKeyE);

    // Hash the message with SHA-256
    const hash = createHash('sha256').update(message).digest();
    const m = this.bufferToBigInt(hash) % n;

    // Compute check = signature^e mod n
    const check = this.modPow(s, e, n);

    return {
      isValid: check === m,
      message,
    };
  }

  /**
   * Full protocol demonstration showing all steps of RSA blind signatures.
   */
  demonstrate() {
    const message = 'This is a secret ballot vote for candidate A';

    // Step 1: Signer generates RSA key pair
    const keys = this.generateKeys();

    // Step 2: Requester blinds the message
    const blindResult = this.blind(message, keys.publicKeyN, keys.publicKeyE);

    // Step 3: Signer signs the blinded message (without seeing the original)
    const signResult = this.signBlinded(
      blindResult.blindedMessage,
      keys.privateKeyD,
      keys.publicKeyN,
    );

    // Step 4: Requester unblinds the signature
    const unblindResult = this.unblind(
      signResult.blindedSignature,
      blindResult.blindingFactor,
      keys.publicKeyN,
    );

    // Step 5: Anyone can verify the signature
    const verifyResult = this.verify(
      message,
      unblindResult.signature,
      keys.publicKeyN,
      keys.publicKeyE,
    );

    // Also show that a wrong message fails verification
    const wrongVerifyResult = this.verify(
      'This is a tampered message',
      unblindResult.signature,
      keys.publicKeyN,
      keys.publicKeyE,
    );

    return {
      description:
        'RSA Blind Signature Protocol - allows a message to be signed without the signer seeing its content',
      protocol: {
        step1_keyGeneration: {
          description: 'Signer generates RSA key pair',
          publicKeyN: keys.publicKeyN,
          publicKeyE: keys.publicKeyE,
          privateKeyD: keys.privateKeyD,
        },
        step2_blinding: {
          description:
            'Requester blinds the message: blindedMsg = message * r^e mod n',
          originalMessage: message,
          messageHash: blindResult.messageHash,
          blindingFactor: blindResult.blindingFactor,
          blindedMessage: blindResult.blindedMessage,
        },
        step3_signing: {
          description:
            'Signer signs blinded message (without seeing original): blindedSig = blindedMsg^d mod n',
          blindedSignature: signResult.blindedSignature,
        },
        step4_unblinding: {
          description:
            'Requester unblinds the signature: signature = blindedSig * r^(-1) mod n',
          finalSignature: unblindResult.signature,
        },
        step5_verification: {
          description: 'Anyone can verify: signature^e mod n == hash(message)',
          isValid: verifyResult.isValid,
          message: verifyResult.message,
        },
      },
      tamperedMessageVerification: {
        description: 'Verification with a tampered message should fail',
        isValid: wrongVerifyResult.isValid,
        message: wrongVerifyResult.message,
      },
    };
  }
}
