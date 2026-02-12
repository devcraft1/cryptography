import { Injectable } from '@nestjs/common';
import { hkdfSync } from 'crypto';

@Injectable()
export class HkdfService {
  derive(
    ikm: string,
    salt?: string,
    info?: string,
    keyLength = 32,
    hash = 'sha256',
  ) {
    const derivedKey = hkdfSync(
      hash,
      ikm,
      salt || '',
      info || '',
      keyLength,
    );

    return {
      derivedKey: Buffer.from(derivedKey).toString('hex'),
      ikm,
      salt: salt || '',
      info: info || '',
      keyLength,
      hash,
    };
  }

  deriveMultiple(
    ikm: string,
    salt?: string,
    labels: string[] = [],
    keyLength = 32,
    hash = 'sha256',
  ) {
    const keys = labels.map((label) => {
      const derivedKey = hkdfSync(
        hash,
        ikm,
        salt || '',
        label,
        keyLength,
      );

      return {
        label,
        derivedKey: Buffer.from(derivedKey).toString('hex'),
      };
    });

    return {
      keys,
      ikm,
      salt: salt || '',
      keyLength,
      hash,
    };
  }

  demonstrate() {
    // 1. Basic derivation from a password-like IKM
    const basicIkm = 'my-secret-password-material';
    const basicSalt = 'application-salt-v1';
    const basicInfo = 'encryption-key';
    const basicResult = this.derive(basicIkm, basicSalt, basicInfo);

    // 2. Multiple key derivation from same IKM with different labels
    const multiLabels = ['encryption-key', 'mac-key', 'iv'];
    const multiResult = this.deriveMultiple(
      basicIkm,
      basicSalt,
      multiLabels,
    );

    // 3. Deterministic: same inputs produce same output
    const deterministicCheck1 = this.derive(basicIkm, basicSalt, basicInfo);
    const deterministicCheck2 = this.derive(basicIkm, basicSalt, basicInfo);
    const isDeterministic =
      deterministicCheck1.derivedKey === deterministicCheck2.derivedKey;

    // 4. Different info produces different keys
    const keyA = this.derive(basicIkm, basicSalt, 'purpose-a');
    const keyB = this.derive(basicIkm, basicSalt, 'purpose-b');
    const differentInfoProducesDifferentKeys =
      keyA.derivedKey !== keyB.derivedKey;

    return {
      basicDerivation: {
        description:
          'Basic HKDF derivation from a password-like IKM with salt and info',
        ...basicResult,
      },
      multipleKeyDerivation: {
        description:
          'Multiple keys derived from the same IKM using different info labels',
        ...multiResult,
      },
      deterministic: {
        description: 'Same inputs always produce the same derived key',
        isDeterministic,
        key1: deterministicCheck1.derivedKey,
        key2: deterministicCheck2.derivedKey,
      },
      differentInfoDifferentKeys: {
        description: 'Different info values produce different keys from the same IKM',
        differentInfoProducesDifferentKeys,
        keyA: keyA.derivedKey,
        keyB: keyB.derivedKey,
      },
      demonstration:
        'HKDF (RFC 5869) extracts and expands keying material to derive multiple cryptographically strong keys from a single input',
    };
  }
}
