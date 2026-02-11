import { Injectable } from '@nestjs/common';
import { getDiffieHellman, createECDH } from 'crypto';

@Injectable()
export class DiffieHellmanService {
  classicDH(groupName: string = 'modp14') {
    const alice = getDiffieHellman(groupName);
    alice.generateKeys();

    const bob = getDiffieHellman(groupName);
    bob.generateKeys();

    const aliceSecret = alice.computeSecret(bob.getPublicKey());
    const bobSecret = bob.computeSecret(alice.getPublicKey());

    return {
      algorithm: 'Diffie-Hellman',
      group: groupName,
      alice: {
        publicKey: alice.getPublicKey('hex').substring(0, 64) + '...',
      },
      bob: {
        publicKey: bob.getPublicKey('hex').substring(0, 64) + '...',
      },
      aliceSharedSecret: aliceSecret.toString('hex').substring(0, 64) + '...',
      bobSharedSecret: bobSecret.toString('hex').substring(0, 64) + '...',
      secretsMatch:
        aliceSecret.toString('hex') === bobSecret.toString('hex'),
    };
  }

  ecdhKeyExchange(curveName: string = 'secp256k1') {
    const alice = createECDH(curveName);
    const alicePublicKey = alice.generateKeys();

    const bob = createECDH(curveName);
    const bobPublicKey = bob.generateKeys();

    const aliceSecret = alice.computeSecret(bobPublicKey);
    const bobSecret = bob.computeSecret(alicePublicKey);

    return {
      algorithm: 'ECDH',
      curve: curveName,
      alice: { publicKey: alicePublicKey.toString('hex') },
      bob: { publicKey: bobPublicKey.toString('hex') },
      aliceSharedSecret: aliceSecret.toString('hex'),
      bobSharedSecret: bobSecret.toString('hex'),
      secretsMatch:
        aliceSecret.toString('hex') === bobSecret.toString('hex'),
    };
  }

  demonstrate() {
    return {
      message:
        'Diffie-Hellman: Two parties agree on a shared secret over an insecure channel',
      ecdh: this.ecdhKeyExchange('secp256k1'),
      keyPoint:
        'Even an eavesdropper seeing both public keys cannot derive the shared secret',
    };
  }
}
