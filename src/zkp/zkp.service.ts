import { Injectable } from '@nestjs/common';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';

@Injectable()
export class ZkpService {
  // RFC 3526 MODP Group 14 (2048-bit) — a well-known safe prime group
  private readonly p = BigInt(
    '0xFFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD1' +
      '29024E088A67CC74020BBEA63B139B22514A08798E3404DD' +
      'EF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245' +
      'E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7ED' +
      'EE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3D' +
      'C2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F' +
      '83655D23DCA3AD961C62F356208552BB9ED529077096966D6' +
      '70C354E4ABC9804F1746C08CA18217C32905E462E36CE3BE' +
      '39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9D' +
      'E2BCBF6955817183995497CEA956AE515D2261898FA051015' +
      '728E5A8AACAA68FFFFFFFFFFFFFFFF',
  );
  private readonly g = BigInt(2);
  private readonly q = (this.p - BigInt(1)) / BigInt(2);

  // WARNING: Not constant-time. For educational purposes only — vulnerable to timing side-channel attacks.
  // For production use, consider a library like noble-curves that provides constant-time operations.
  private modPow(base: bigint, exp: bigint, mod: bigint): bigint {
    let e = ((exp % mod) + mod) % mod;
    base = ((base % mod) + mod) % mod;
    let result = BigInt(1);
    while (e > BigInt(0)) {
      if (e & BigInt(1)) {
        result = (result * base) % mod;
      }
      e >>= BigInt(1);
      base = (base * base) % mod;
    }
    return result;
  }

  private hashSecret(secret: string): bigint {
    const hash = createHash('sha256').update(secret).digest('hex');
    const x = (BigInt('0x' + hash) % (this.q - BigInt(1))) + BigInt(1);
    return x;
  }

  private randomBigInt(): bigint {
    const bytes = randomBytes(32);
    const val =
      (BigInt('0x' + bytes.toString('hex')) % (this.q - BigInt(1))) +
      BigInt(1);
    return val;
  }

  /**
   * Constant-length timing-safe comparison for bigint hex values.
   * Pads both values to the same length before comparing.
   */
  private timingSafeCompare(a: bigint, b: bigint): boolean {
    const aHex = a.toString(16);
    const bHex = b.toString(16);
    const maxLen = Math.max(aHex.length, bHex.length);
    const aBuf = new Uint8Array(Buffer.from(aHex.padStart(maxLen, '0')));
    const bBuf = new Uint8Array(Buffer.from(bHex.padStart(maxLen, '0')));
    return aBuf.length === bBuf.length && timingSafeEqual(aBuf, bBuf);
  }

  generatePublicValue(secret: string) {
    const x = this.hashSecret(secret);
    const y = this.modPow(this.g, x, this.p);
    return {
      publicValue: y.toString(16),
      secret,
    };
  }

  createCommitment(secret: string) {
    const x = this.hashSecret(secret);
    const y = this.modPow(this.g, x, this.p);
    const k = this.randomBigInt();
    const t = this.modPow(this.g, k, this.p);
    return {
      commitment: t.toString(16),
      k: k.toString(16),
      publicValue: y.toString(16),
    };
  }

  createChallenge() {
    const c = this.randomBigInt();
    return {
      challenge: c.toString(16),
    };
  }

  createResponse(secret: string, k: string, challenge: string) {
    const x = this.hashSecret(secret);
    const kBig = BigInt('0x' + k);
    const c = BigInt('0x' + challenge);
    const s = (kBig + c * x) % this.q;
    return {
      response: s.toString(16),
    };
  }

  verify(
    publicValue: string,
    commitment: string,
    challenge: string,
    response: string,
  ) {
    const y = BigInt('0x' + publicValue);
    const t = BigInt('0x' + commitment);
    const c = BigInt('0x' + challenge);
    const s = BigInt('0x' + response);

    const left = this.modPow(this.g, s, this.p);

    const yc = this.modPow(y, c, this.p);
    const right = (t * yc) % this.p;

    const isValid = this.timingSafeCompare(left, right);

    return {
      isValid,
      explanation: isValid
        ? 'Proof is VALID: g^s mod p == t * y^c mod p. The prover knows the secret without revealing it.'
        : 'Proof is INVALID: g^s mod p != t * y^c mod p. The prover could not demonstrate knowledge of the secret.',
    };
  }

  demonstrate() {
    const secret = randomBytes(16).toString('hex');

    const { publicValue } = this.generatePublicValue(secret);
    const { commitment, k } = this.createCommitment(secret);
    const { challenge } = this.createChallenge();
    const { response } = this.createResponse(secret, k, challenge);

    const validResult = this.verify(
      publicValue,
      commitment,
      challenge,
      response,
    );

    const wrongResponse = this.randomBigInt().toString(16);
    const invalidResult = this.verify(
      publicValue,
      commitment,
      challenge,
      wrongResponse,
    );

    return {
      protocol: 'Schnorr Zero-Knowledge Proof',
      description:
        'Proves knowledge of a discrete logarithm (secret x where y = g^x mod p) without revealing x.',
      steps: {
        step1_publicValue: {
          description:
            'Prover computes public value y = g^x mod p from secret x',
          publicValue: publicValue.substring(0, 64) + '...',
        },
        step2_commitment: {
          description:
            'Prover picks random k, sends commitment t = g^k mod p',
          commitment: commitment.substring(0, 64) + '...',
        },
        step3_challenge: {
          description: 'Verifier sends random challenge c',
          challenge: challenge.substring(0, 64) + '...',
        },
        step4_response: {
          description: 'Prover computes response s = (k + c*x) mod q',
          response: response.substring(0, 64) + '...',
        },
        step5_verification: {
          description: 'Verifier checks: g^s mod p == t * y^c mod p',
          ...validResult,
        },
      },
      validProof: validResult,
      invalidProof: {
        description: 'Verification with a wrong (random) response',
        wrongResponse: wrongResponse.substring(0, 64) + '...',
        ...invalidResult,
      },
      keyInsight:
        'The prover never reveals the secret x. The verifier is convinced ' +
        'the prover knows x because only someone who knows x can compute ' +
        's = k + c*x such that g^s = t * y^c mod p.',
    };
  }
}
