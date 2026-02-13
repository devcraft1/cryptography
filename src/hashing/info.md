# Cryptographic Hashing

**Slug:** `cryptographic-hashing`
**Category:** Hashing

> Cryptographic hash functions produce a fixed-size, deterministic fingerprint of arbitrary input data, designed to be irreversible and collision-resistant.

## Description

A cryptographic hash function takes an arbitrary-length input and produces a fixed-length output (digest or hash) with specific security properties: preimage resistance (given a hash, it is infeasible to find the input), second preimage resistance (given an input, it is infeasible to find a different input with the same hash), and collision resistance (it is infeasible to find any two different inputs with the same hash).

The SHA-2 family (SHA-256, SHA-384, SHA-512) is the most widely deployed set of cryptographic hash functions, standardized by NIST. SHA-256 produces a 256-bit (32-byte) digest and is used extensively in TLS, code signing, blockchain, and data integrity verification. SHA-3 (Keccak) was standardized in 2015 as an alternative with a fundamentally different internal structure (sponge construction vs. Merkle-Damgard), providing algorithm diversity.

Cryptographic hash functions are deterministic (same input always produces the same output), fast to compute, and exhibit an avalanche effect (a tiny change in input produces a completely different hash). They are distinct from password hashing functions (like bcrypt or Argon2) which are intentionally slow to resist brute-force attacks.

## How It Works

1. The input message is padded to a multiple of the hash function's block size (e.g., 512 bits for SHA-256).
2. The padded message is split into fixed-size blocks and processed sequentially through a compression function.
3. Each block is combined with the current internal state using a series of bitwise operations, modular additions, and logical functions.
4. After all blocks are processed, the final internal state is output as the hash digest.
5. The same input always produces the same digest, and even a single-bit change in the input produces a completely different digest (avalanche effect).

## Real-World Use Cases

- Data integrity verification: comparing hash digests to detect file corruption or tampering (e.g., SHA-256 checksums for software downloads).
- Digital signatures hash the message before signing to produce a fixed-size input for the signature algorithm.
- Blockchain and cryptocurrency: Bitcoin's proof-of-work is based on SHA-256; Ethereum uses Keccak-256.
- Content-addressable storage systems (Git, IPFS) use hashes as unique identifiers for data.
- HMAC (Hash-based Message Authentication Code) uses hash functions to provide message authentication.

## Security Considerations

- MD5 and SHA-1 are cryptographically broken and must not be used for security-sensitive applications. SHA-1 collision attacks have been demonstrated (SHAttered).
- Hash functions are NOT suitable for password storage; use dedicated password hashing functions (Argon2, bcrypt, scrypt) that are intentionally slow.
- Length-extension attacks affect Merkle-Damgard constructions (SHA-256, SHA-512): knowing H(m) allows computing H(m || padding || m') without knowing m. Use HMAC or SHA-3 to avoid this.
- The output length determines collision resistance: SHA-256 provides 128 bits of collision resistance (birthday bound), which is sufficient for most applications.
- Quantum computers reduce collision resistance by approximately half (Grover's algorithm), so SHA-256 provides about 128 bits of post-quantum security.

## Alternatives

| Name | Comparison |
|------|-----------|
| SHA-3 (Keccak) | NIST-standardized hash function with a sponge construction instead of Merkle-Damgard. Not vulnerable to length-extension attacks. Similar performance to SHA-2 in software. |
| BLAKE2 / BLAKE3 | High-performance hash functions faster than SHA-256 in software. BLAKE2 is widely used (e.g., in Argon2, WireGuard). BLAKE3 offers parallelizable hashing for even higher throughput. |
| Argon2 / bcrypt / scrypt | Password hashing functions designed to be computationally expensive and memory-hard, resisting GPU and ASIC-based brute-force attacks. Not general-purpose hash functions. |

## References

- [NIST FIPS 180-4: Secure Hash Standard (SHS) — SHA-1, SHA-224, SHA-256, SHA-384, SHA-512](https://csrc.nist.gov/publications/detail/fips/180/4/final)
- [NIST FIPS 202: SHA-3 Standard — Permutation-Based Hash and Extendable-Output Functions](https://csrc.nist.gov/publications/detail/fips/202/final)
- [RFC 6234: US Secure Hash Algorithms (SHA and SHA-based HMAC and HKDF)](https://datatracker.ietf.org/doc/html/rfc6234)
