# Post-Quantum Cryptography

**Slug:** `post-quantum-cryptography`
**Category:** Post-Quantum Cryptography

> Post-quantum cryptography encompasses algorithms designed to resist attacks from both classical and quantum computers, securing systems against the future threat of large-scale quantum computing.

## Description

Post-quantum cryptography (PQC) refers to cryptographic algorithms that are believed to be secure against attacks by quantum computers. Current widely-used public key algorithms — RSA, ECDSA, ECDH, and DSA — are all vulnerable to Shor's algorithm, which can efficiently solve the integer factorization and discrete logarithm problems that underpin their security on a sufficiently powerful quantum computer.

NIST completed its Post-Quantum Cryptography Standardization process with the publication of three initial standards in 2024: ML-KEM (Module-Lattice-Based Key Encapsulation Mechanism, based on CRYSTALS-Kyber) for key exchange, ML-DSA (Module-Lattice-Based Digital Signature Algorithm, based on CRYSTALS-Dilithium) for digital signatures, and SLH-DSA (Stateless Hash-Based Digital Signature Algorithm, based on SPHINCS+) as a hash-based signature backup.

The primary mathematical foundations for PQC include lattice-based cryptography (ML-KEM, ML-DSA), hash-based signatures (SLH-DSA, XMSS, LMS), code-based cryptography (Classic McEliece), and multivariate polynomial cryptography. Lattice-based schemes have emerged as the most practical, offering reasonable key and signature sizes with strong security guarantees. The transition to PQC is underway, with hybrid approaches (combining classical and PQC algorithms) recommended during the migration period.

## How It Works

1. **ML-KEM (Kyber):** Key generation creates a public/private key pair based on Module Learning With Errors (MLWE). Encapsulation uses the public key to produce a shared secret and ciphertext. Decapsulation uses the private key to recover the shared secret.
2. **ML-DSA (Dilithium):** Signing uses rejection sampling on lattice operations to produce a signature without leaking the private key. Verification checks the signature against the public key using module lattice arithmetic.
3. **SLH-DSA (SPHINCS+):** Uses a hierarchy of hash-based one-time and few-time signature schemes (WOTS+, FORS) organized in a hyper-tree structure, providing stateless hash-based signatures.
4. **Hybrid key exchange:** a classical key exchange (ECDH) and a PQC key exchange (ML-KEM) are performed in parallel, and both shared secrets are combined, ensuring security as long as either algorithm remains unbroken.
5. The security of lattice-based schemes relies on the hardness of the Learning With Errors (LWE) problem, which is believed to resist both classical and quantum attacks.

## Real-World Use Cases

- TLS 1.3 hybrid key exchange using X25519+ML-KEM-768 (already deployed by Google Chrome and Cloudflare).
- Signal Protocol's PQXDH handshake adds ML-KEM-1024 alongside X25519 for post-quantum forward secrecy.
- Long-term data protection: encrypting classified or sensitive data that must remain confidential for decades ("harvest now, decrypt later" threat).
- Code signing and software update verification with ML-DSA to ensure integrity against future quantum attacks.
- Government and defense systems migrating to PQC algorithms per NIST guidelines and executive mandates.

## Security Considerations

- PQC algorithms are relatively new compared to RSA/ECC; their security assumptions (LWE hardness) have less scrutiny. Hybrid approaches mitigate this risk.
- Key and signature sizes for PQC are significantly larger than ECC equivalents: ML-KEM-768 public keys are ~1,184 bytes vs. 32 bytes for X25519.
- Implementation security is critical; side-channel attacks on lattice-based schemes (timing, power analysis) require careful constant-time implementation.
- The "harvest now, decrypt later" threat means data encrypted today with classical algorithms may be decrypted by future quantum computers; migration should begin now for long-lived secrets.
- Stateful hash-based signatures (XMSS, LMS) must never reuse state; state management failure is catastrophic. SLH-DSA (SPHINCS+) avoids this by being stateless.

## Alternatives

| Name | Comparison |
|------|-----------|
| Classical Cryptography (RSA, ECC) | Current widely-deployed algorithms that are efficient and well-understood but vulnerable to quantum attacks. Still secure against classical computers and used alongside PQC in hybrid schemes. |
| Quantum Key Distribution (QKD) | Uses quantum mechanics (not mathematics) to distribute keys with information-theoretic security. Requires specialized hardware and point-to-point quantum channels. Not a software solution and has distance limitations. |
| Hash-Based Signatures (LMS, XMSS) | Stateful hash-based signature schemes with minimal security assumptions (only hash function security). NIST-standardized (SP 800-208) but require careful state management to prevent key reuse. |

## References

- [NIST FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism Standard (ML-KEM)](https://csrc.nist.gov/publications/detail/fips/203/final)
- [NIST FIPS 204: Module-Lattice-Based Digital Signature Standard (ML-DSA)](https://csrc.nist.gov/publications/detail/fips/204/final)
- [NIST FIPS 205: Stateless Hash-Based Digital Signature Standard (SLH-DSA)](https://csrc.nist.gov/publications/detail/fips/205/final)
