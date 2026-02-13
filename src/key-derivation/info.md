# Key Derivation (PBKDF2, scrypt, Argon2)

**Slug:** `key-derivation`
**Category:** Key Derivation

> Password-based key derivation functions convert human-memorable passwords into strong cryptographic keys using intentionally slow, resource-intensive computations to resist brute-force attacks.

## Description

Password-based key derivation functions (PBKDFs) are designed to transform a low-entropy password into a high-entropy cryptographic key suitable for encryption or authentication. Unlike fast hash functions (SHA-256) or key derivation functions (HKDF), PBKDFs are intentionally slow and resource-intensive to make brute-force and dictionary attacks impractical.

Three primary algorithms dominate this space: PBKDF2, scrypt, and Argon2. PBKDF2 (Password-Based Key Derivation Function 2) applies HMAC iteratively, with a configurable iteration count controlling computational cost. It is widely standardized but only CPU-hard, making it vulnerable to GPU and ASIC attacks. scrypt adds memory-hardness to the computation, requiring significant RAM that makes GPU and ASIC attacks much more expensive. Argon2, the winner of the Password Hashing Competition (2015), provides both time and memory hardness with configurable parallelism, making it the recommended choice for new applications.

All three functions require a unique, random salt per password to prevent rainbow table attacks and ensure that identical passwords produce different derived keys.

## How It Works

1. A unique random salt (at least 128 bits) is generated and stored alongside the derived key or hash.
2. **PBKDF2:** Applies HMAC(password, salt || counter) iteratively for a configured number of rounds (e.g., 600,000 for SHA-256), XORing intermediate results to produce the derived key.
3. **scrypt:** Generates a large pseudorandom memory buffer using a mixing function (ROMix/BlockMix), then accesses it in a data-dependent pattern, forcing attackers to maintain the full buffer in memory.
4. **Argon2:** Fills a memory array of configurable size with data derived from the password and salt, then performs multiple passes over the array with data-dependent (Argon2d) or data-independent (Argon2i) indexing.
5. The output is a fixed-length derived key (or password hash) that is deterministic for the same password, salt, and parameters.

## Real-World Use Cases

- Password storage in authentication systems: storing Argon2/scrypt/PBKDF2 hashes instead of plaintext or simple hash digests.
- Full-disk encryption (LUKS, FileVault, BitLocker) derives the encryption key from the user's password using PBKDF2 or Argon2.
- Cryptocurrency wallet encryption derives keys from a passphrase to protect private keys at rest.
- WPA2/WPA3 Wi-Fi security uses PBKDF2-SHA1 to derive the pairwise master key from the network password.
- Password managers derive the master encryption key from the user's master password using Argon2 or PBKDF2.

## Security Considerations

- Iteration counts / cost parameters must be tuned to the deployment environment; too low makes brute-force feasible, too high impacts user experience. OWASP recommends Argon2id with 19 MiB memory and 2 iterations minimum.
- PBKDF2 lacks memory-hardness, making it vulnerable to GPU and ASIC-based cracking. Prefer Argon2 or scrypt for new applications.
- Each password must use a unique random salt (at least 128 bits) to prevent rainbow table attacks and multi-target pre-computation.
- Argon2id is the recommended variant, combining the side-channel resistance of Argon2i (first pass) with the GPU resistance of Argon2d (subsequent passes).
- The cost parameters used should be stored alongside the hash to allow future upgrades without breaking existing stored credentials.

## Alternatives

| Name | Comparison |
|------|-----------|
| HKDF | A fast key derivation function designed for deriving keys from high-entropy input (e.g., DH shared secrets). NOT suitable for passwords because it offers no brute-force resistance. |
| bcrypt | A password hashing function based on the Blowfish cipher. Memory-hard to a limited degree. Well-tested but limited to 72-byte passwords and has no configurable memory parameter. |
| Balloon Hashing | A memory-hard function with a simpler design than scrypt/Argon2 and provable security guarantees. Less widely adopted but interesting from a theoretical perspective. |

## References

- [RFC 8018: PKCS #5 — Password-Based Cryptography Specification Version 2.1 (PBKDF2)](https://datatracker.ietf.org/doc/html/rfc8018)
- [RFC 9106: Argon2 Memory-Hard Function for Password Hashing and Proof-of-Work Applications](https://datatracker.ietf.org/doc/html/rfc9106)
- [Colin Percival — Stronger Key Derivation via Sequential Memory-Hard Functions (scrypt)](https://www.tarsnap.com/scrypt/scrypt.pdf)
