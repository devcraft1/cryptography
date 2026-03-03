import { BadRequestException, Injectable } from '@nestjs/common';
import {
  generateKeyPairSync,
  generateKeyPair,
  createHash,
  randomBytes,
  timingSafeEqual,
} from 'crypto';
import { promisify } from 'util';

const generateKeyPairAsync = promisify(generateKeyPair);

@Injectable()
export class BlindSignaturesService {

  // WARNING: Not constant-time. For educational purposes only — vulnerable to timing side-channel attacks.
  // For production use, use a library like node-forge or WebCrypto API with proper RSA padding.
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
      throw new BadRequestException('invalid parameters: modular inverse does not exist');
    }

    return ((old_s % m) + m) % m;
  }

  private bufferToBigInt(buf: Buffer): bigint {
    const hex = buf.toString('hex');
    if (hex.length === 0) return BigInt(0);
    return BigInt('0x' + hex);
  }

  private bigIntToHex(n: bigint): string {
    const hex = n.toString(16);
    return hex.length % 2 === 0 ? hex : '0' + hex;
  }

  private hexToBigInt(hex: string): bigint {
    if (!/^[0-9a-f]+$/i.test(hex)) {
      throw new BadRequestException('invalid hex string');
    }
    return BigInt('0x' + hex);
  }

  private gcd(a: bigint, b: bigint): bigint {
    a = a < BigInt(0) ? -a : a;
    b = b < BigInt(0) ? -b : b;
    while (b !== BigInt(0)) {
      [a, b] = [b, a % b];
    }
    return a;
  }

  private generateKeysSync(bits = 2048) {
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

  generateKeys(bits = 2048) {
    return this.generateKeysSync(bits);
  }

  async generateFreshKeys(bits = 2048) {
    const { publicKey, privateKey } = await generateKeyPairAsync('rsa', {
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

  blind(message: string, publicKeyN: string, publicKeyE: string) {
    const n = this.hexToBigInt(publicKeyN);
    const e = this.hexToBigInt(publicKeyE);

    const hash = createHash('sha256').update(message).digest();
    const m = this.bufferToBigInt(hash) % n;

    let r: bigint;
    do {
      const rBytes = randomBytes(Math.ceil(n.toString(16).length / 2));
      r = this.bufferToBigInt(rBytes) % n;
    } while (r <= BigInt(1) || this.gcd(r, n) !== BigInt(1));

    const rToE = this.modPow(r, e, n);
    const blindedMessage = (m * rToE) % n;

    return {
      blindedMessage: this.bigIntToHex(blindedMessage),
      blindingFactor: this.bigIntToHex(r),
      messageHash: this.bigIntToHex(m),
    };
  }

  signBlinded(
    blindedMessage: string,
    privateKeyD: string,
    publicKeyN: string,
  ) {
    const bm = this.hexToBigInt(blindedMessage);
    const d = this.hexToBigInt(privateKeyD);
    const n = this.hexToBigInt(publicKeyN);

    const blindedSignature = this.modPow(bm, d, n);

    return {
      blindedSignature: this.bigIntToHex(blindedSignature),
    };
  }

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

  verify(
    message: string,
    signature: string,
    publicKeyN: string,
    publicKeyE: string,
  ) {
    const s = this.hexToBigInt(signature);
    const n = this.hexToBigInt(publicKeyN);
    const e = this.hexToBigInt(publicKeyE);

    const hash = createHash('sha256').update(message).digest();
    const m = this.bufferToBigInt(hash) % n;

    const check = this.modPow(s, e, n);

    // Pad both to the same length for constant-time comparison
    const checkHex = this.bigIntToHex(check);
    const mHex = this.bigIntToHex(m);
    const maxLen = Math.max(checkHex.length, mHex.length);
    const a = new Uint8Array(Buffer.from(checkHex.padStart(maxLen, '0')));
    const b = new Uint8Array(Buffer.from(mHex.padStart(maxLen, '0')));
    const isValid = a.length === b.length && timingSafeEqual(a, b);

    return {
      isValid,
      message,
    };
  }

  demonstrate() {
    const message = 'This is a secret ballot vote for candidate A';

    const keys = this.generateKeys();
    const blindResult = this.blind(
      message,
      keys.publicKeyN,
      keys.publicKeyE,
    );
    const signResult = this.signBlinded(
      blindResult.blindedMessage,
      keys.privateKeyD,
      keys.publicKeyN,
    );
    const unblindResult = this.unblind(
      signResult.blindedSignature,
      blindResult.blindingFactor,
      keys.publicKeyN,
    );
    const verifyResult = this.verify(
      message,
      unblindResult.signature,
      keys.publicKeyN,
      keys.publicKeyE,
    );
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
          description:
            'Anyone can verify: signature^e mod n == hash(message)',
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
