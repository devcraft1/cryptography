# Elliptic Curve Cryptography

**Slug:** `elliptic-curve-cryptography`
**Category:** Asymmetric Cryptography

> Elliptic Curve Cryptography (ECC) uses the algebraic structure of elliptic curves over finite fields to provide public key cryptography with smaller keys and faster operations than RSA.

## Description

Elliptic Curve Cryptography (ECC) is a family of public key algorithms based on the algebraic structure of elliptic curves over finite fields. First proposed independently by Neal Koblitz and Victor Miller in 1985, ECC provides the same security guarantees as RSA and classical Diffie-Hellman but with significantly smaller key sizes — a 256-bit ECC key provides security roughly equivalent to a 3072-bit RSA key.

An elliptic curve is defined by an equation of the form y^2 = x^3 + ax + b over a finite field. Points on the curve form an abelian group under a geometric addition operation. The security of ECC relies on the Elliptic Curve Discrete Logarithm Problem (ECDLP): given points P and Q = kP on the curve, it is computationally infeasible to determine the scalar k.

ECC encompasses several specific algorithms: ECDH and ECDHE for key exchange, ECDSA for digital signatures, and EdDSA (including Ed25519 and Ed448) for deterministic signatures. Commonly used curves include NIST P-256 (secp256r1), Curve25519, and secp256k1 (used in Bitcoin). Curve25519 and Ed25519, designed by Daniel J. Bernstein, are particularly popular due to their resistance to implementation pitfalls and constant-time performance characteristics.

## How It Works

1. A specific elliptic curve and base point G on that curve are chosen as public domain parameters (e.g., NIST P-256 or Curve25519).
2. The private key is a randomly generated integer k within the valid range for the chosen curve.
3. The public key is computed as Q = kG (scalar multiplication of the base point G by the private key k).
4. For key exchange (ECDH): two parties exchange public keys and compute the shared point S = k_A * Q_B = k_B * Q_A. The x-coordinate of S becomes the shared secret.
5. For signatures (ECDSA/EdDSA): the private key is used to produce a signature on a message hash, and the public key allows anyone to verify the signature.

## Real-World Use Cases

- TLS 1.3 key exchange using ECDHE with P-256 or X25519 for establishing session keys.
- Cryptocurrency systems: Bitcoin uses secp256k1 for transaction signing; Ethereum uses the same curve.
- SSH key authentication using Ed25519 keys, now the recommended default.
- Mobile and IoT devices where constrained resources favor ECC's smaller key sizes and faster operations.
- Secure messaging protocols (Signal, WhatsApp) use X25519 for key agreement in the Double Ratchet algorithm.

## Security Considerations

- Curve selection matters: some curves have suspected backdoors (e.g., concerns about NIST curves' parameter generation). Curve25519 and Ed25519 are widely trusted.
- ECDSA requires a unique, high-quality random nonce per signature; any nonce issue leads to private key recovery. EdDSA avoids this by being deterministic.
- ECC is vulnerable to quantum computing: Shor's algorithm can solve ECDLP efficiently. Post-quantum alternatives are being standardized.
- Invalid curve attacks can occur if point validation is not performed during ECDH; implementations must verify received points lie on the expected curve.
- Side-channel attacks (timing, power analysis) are a significant concern; implementations must use constant-time algorithms like Montgomery ladder.

## Alternatives

| Name | Comparison |
|------|-----------|
| RSA | The classical asymmetric algorithm based on integer factorization. Requires much larger keys (2048-4096 bits) for equivalent security and is slower for key generation and signing. Still widely used for backward compatibility. |
| ML-KEM / ML-DSA (Kyber / Dilithium) | Post-quantum lattice-based algorithms that resist quantum attacks. Larger keys and signatures than ECC but designed for long-term security against quantum computers. |
| Ed448 | A higher-security Edwards curve providing approximately 224 bits of security versus Ed25519's 128 bits, at the cost of larger keys and slower operations. |

## References

- [NIST SP 800-186: Recommendations for Discrete Logarithm-based Cryptography: Elliptic Curve Domain Parameters](https://csrc.nist.gov/publications/detail/sp/800-186/final)
- [RFC 7748: Elliptic Curves for Security (X25519, X448)](https://datatracker.ietf.org/doc/html/rfc7748)
- [Daniel J. Bernstein — Curve25519: New Diffie-Hellman Speed Records](https://cr.yp.to/ecdh/curve25519-20060209.pdf)
