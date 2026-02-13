# Key Pair Generation

**Slug:** `key-pair-generation`
**Category:** Key Management

> Key pair generation creates mathematically linked public and private keys used in asymmetric cryptography for encryption, digital signatures, and key exchange.

## Description

Key pair generation is the foundational operation in asymmetric (public key) cryptography. It produces two mathematically related keys: a private key (kept secret by the owner) and a public key (distributed openly). The relationship between the keys is such that operations performed with one can only be reversed with the other, but deriving the private key from the public key is computationally infeasible.

The key generation process varies by algorithm. For RSA, it involves generating two large random primes and computing their product. For elliptic curve algorithms (ECDSA, EdDSA, ECDH), the private key is a random integer and the public key is the result of scalar multiplication on the chosen curve. For post-quantum algorithms like ML-KEM (Kyber) and ML-DSA (Dilithium), key generation involves lattice operations.

The security of the entire asymmetric cryptosystem depends on the quality of key generation: the randomness source must be cryptographically secure, key sizes must meet minimum requirements for the target security level, and the private key must be protected from the moment of generation. Hardware Security Modules (HSMs), Trusted Platform Modules (TPMs), and secure enclaves are used in high-security environments to generate and store keys in tamper-resistant hardware.

## How It Works

1. A cryptographically secure random number generator (CSPRNG) is seeded with sufficient entropy from the operating system.
2. **For RSA:** two large random primes p and q are generated (using probabilistic primality testing), and the modulus n = p * q, public exponent e, and private exponent d are computed.
3. **For ECC:** a random integer within the curve's order is generated as the private key, and the public key is computed as the scalar multiple of the curve's base point.
4. **For EdDSA (Ed25519):** a 32-byte random seed is generated; the private scalar is derived by hashing the seed, and the public key is the scalar multiple of the base point.
5. The public key is exported (often in PEM, DER, or JWK format) for distribution, while the private key is stored securely with appropriate access controls.

## Real-World Use Cases

- Generating TLS certificates: a key pair is created, the public key is embedded in a CSR, and the private key is installed on the server.
- SSH key generation (ssh-keygen) creates Ed25519 or RSA key pairs for passwordless server authentication.
- Cryptocurrency wallet creation generates an ECC key pair (secp256k1) where the public key derives the wallet address.
- Code signing infrastructure generates key pairs for signing software packages and verifying their authenticity.
- PGP/GPG key generation for email encryption and signing.

## Security Considerations

- The random number generator must be a CSPRNG seeded with sufficient hardware entropy; weak randomness leads to predictable keys and complete compromise.
- RSA key generation must use strong primality tests and validated prime generation procedures to avoid weak or factorable moduli.
- Private keys should be generated in secure memory, never written to disk in plaintext, and protected with appropriate access controls or hardware security modules.
- Key sizes must meet current minimum requirements: RSA >= 2048 bits (4096 recommended), ECC >= 256 bits (P-256 or Curve25519), EdDSA = Ed25519 or Ed448.
- Key pair generation for long-term keys should occur in a trusted environment; consider HSMs or secure enclaves for high-value keys.

## Alternatives

| Name | Comparison |
|------|-----------|
| Pre-Shared Keys (PSK) | Symmetric keys shared between parties in advance. Simpler but don't solve the key distribution problem. Suitable when a secure channel for key exchange already exists. |
| Key Encapsulation Mechanisms (KEMs) | Modern approach where key generation produces an encapsulation key pair, and the encapsulate operation produces both a shared secret and ciphertext. Cleaner API than traditional public key encryption. |
| Threshold Key Generation | Distributed key generation where the private key is split among multiple parties, and a threshold number must cooperate to sign or decrypt. More complex but eliminates single points of failure. |

## References

- [NIST SP 800-56A: Recommendation for Pair-Wise Key-Establishment Schemes Using Discrete Logarithm Cryptography](https://csrc.nist.gov/publications/detail/sp/800-56a/rev-3/final)
- [NIST SP 800-133: Recommendation for Cryptographic Key Generation](https://csrc.nist.gov/publications/detail/sp/800-133/rev-2/final)
- [RFC 8032: Edwards-Curve Digital Signature Algorithm (EdDSA) — Key Generation](https://datatracker.ietf.org/doc/html/rfc8032)
