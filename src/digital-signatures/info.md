# Digital Signatures

**Slug:** `digital-signatures`
**Category:** Authentication

> Digital signatures provide authentication, integrity, and non-repudiation by allowing a signer to produce a verifiable proof that they endorsed a specific message.

## Description

Digital signatures are cryptographic mechanisms that provide three fundamental security properties: authentication (proving who created or approved a message), integrity (ensuring the message has not been altered), and non-repudiation (preventing the signer from denying they signed it). They are the digital equivalent of handwritten signatures, but with mathematically provable security guarantees.

A digital signature scheme consists of three algorithms: key generation (producing a public/private key pair), signing (using the private key to create a signature on a message), and verification (using the public key to check the signature's validity). The security relies on the computational infeasibility of forging a valid signature without knowledge of the private key.

The most widely used signature algorithms include RSA (based on the difficulty of factoring large numbers), ECDSA and EdDSA (based on elliptic curve discrete logarithm problems), and more recently, post-quantum schemes like ML-DSA (Dilithium). EdDSA (particularly Ed25519) has become the preferred choice for new systems due to its performance, simplicity, and resistance to implementation pitfalls that plague ECDSA.

## How It Works

1. The signer generates a public/private key pair. The private key is kept secret; the public key is distributed openly.
2. To sign a message, the signer first computes a cryptographic hash of the message, then applies the signing algorithm using their private key to produce a signature.
3. The message and signature are sent to the verifier together.
4. The verifier uses the signer's public key and the verification algorithm to check whether the signature is valid for the given message.
5. If verification succeeds, the verifier has assurance that the message was signed by the holder of the corresponding private key and has not been modified.

## Real-World Use Cases

- Code signing to ensure software updates and packages have not been tampered with (e.g., GPG signatures on Linux packages).
- TLS certificate chains where CAs digitally sign certificates to vouch for domain ownership.
- Document signing for legal contracts, regulatory filings, and electronic notarization.
- Cryptocurrency transactions where digital signatures authorize the transfer of funds.
- Git commit signing to verify the identity of code contributors.

## Security Considerations

- Private key protection is paramount; compromise of the signing key allows unlimited forgery.
- ECDSA requires a unique, unpredictable nonce for each signature; nonce reuse or bias leaks the private key (as demonstrated by the PlayStation 3 hack).
- EdDSA (Ed25519) is deterministic and avoids the nonce-related pitfalls of ECDSA, making it safer to implement.
- Hash function strength matters: the hash used in sign-then-hash schemes must be collision-resistant.
- RSA signatures require proper padding schemes (PSS is recommended over PKCS#1 v1.5) to prevent existential forgery attacks.

## Alternatives

| Name | Comparison |
|------|-----------|
| HMAC | Provides authentication and integrity using a shared secret key, but does not provide non-repudiation since both parties hold the same key. Faster than digital signatures. |
| ML-DSA (Dilithium) | A lattice-based post-quantum signature scheme standardized by NIST, designed to resist quantum computer attacks. Larger signatures and keys than classical schemes. |
| Ring Signatures | Allow signing on behalf of a group without revealing which member signed. Provide anonymity but sacrifice non-repudiation. |

## References

- [NIST FIPS 186-5: Digital Signature Standard (DSS)](https://csrc.nist.gov/publications/detail/fips/186/5/final)
- [RFC 8032: Edwards-Curve Digital Signature Algorithm (EdDSA)](https://datatracker.ietf.org/doc/html/rfc8032)
- [RFC 8017: PKCS #1 — RSA Cryptography Specifications (includes RSA-PSS)](https://datatracker.ietf.org/doc/html/rfc8017)
