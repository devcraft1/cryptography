# Cryptographic Random Number Generation

**Slug:** `cryptographic-random-number-generation`
**Category:** Randomness

> Cryptographically secure random number generators (CSPRNGs) produce unpredictable, unbiased random values essential for key generation, nonces, salts, and all security-critical operations.

## Description

Cryptographic random number generation produces random values that are computationally indistinguishable from truly random values, even to an adversary with significant computational resources. Unlike general-purpose pseudo-random number generators (PRNGs) used in simulations or games, cryptographically secure PRNGs (CSPRNGs) must satisfy stringent unpredictability requirements: given any sequence of previous outputs, predicting the next output must be computationally infeasible.

CSPRNGs combine hardware entropy sources (CPU timing jitter, thermal noise, interrupt timing, hardware RNG instructions like Intel's RDRAND) with deterministic algorithms (typically based on block ciphers or hash functions) to stretch limited hardware entropy into a continuous stream of random bytes. Operating systems provide CSPRNG interfaces: /dev/urandom and getrandom() on Linux, CryptGenRandom/BCryptGenRandom on Windows, and SecRandomCopyBytes on macOS/iOS.

Every security-critical random value in cryptography depends on CSPRNG quality: encryption keys, nonces, IVs, salts, ECDSA per-signature nonces, session tokens, password reset tokens, and more. A single predictable random value can compromise an entire cryptographic system — the 2010 Sony PlayStation 3 ECDSA hack exploited a static nonce, and the Debian OpenSSL bug (CVE-2008-0166) reduced key entropy to only 15 bits due to a broken PRNG.

## How It Works

1. Hardware entropy is collected from physical sources: CPU instruction timing, thermal sensor noise, interrupt timing, dedicated hardware RNGs (RDRAND/RDSEED), and device driver events.
2. The entropy is fed into an entropy pool (e.g., Linux's input_pool) and mixed using cryptographic operations to produce uniformly distributed seed material.
3. A CSPRNG algorithm (e.g., ChaCha20-based in Linux 4.8+, or CTR_DRBG in NIST SP 800-90A) uses the seed to generate a stream of pseudorandom bytes.
4. The CSPRNG periodically reseeds from the entropy pool to maintain forward secrecy: even if the internal state is compromised, future outputs become secure after reseeding.
5. Applications request random bytes through OS APIs (getrandom(), /dev/urandom) or language-level interfaces (crypto.randomBytes() in Node.js, os.urandom() in Python).

## Real-World Use Cases

- Generating symmetric encryption keys (AES-256) that must be uniformly random and unpredictable.
- Creating nonces and IVs for AES-GCM, ChaCha20-Poly1305, and other encryption modes.
- Generating unique salts for password hashing with Argon2, bcrypt, or PBKDF2.
- Producing ECDSA per-signature nonces (k values) where predictability leads to private key recovery.
- Generating session tokens, CSRF tokens, password reset tokens, and API keys in web applications.

## Security Considerations

- Never use Math.random(), rand(), or general-purpose PRNGs for security purposes; they are predictable and not designed for cryptographic use.
- On virtual machines and containers, entropy starvation at boot can produce predictable random values; ensure adequate entropy seeding before generating keys.
- RDRAND/RDSEED hardware instructions should not be the sole entropy source, as they are opaque and cannot be independently audited. Use them as one input to the entropy pool.
- Fork safety: after a process fork, the child's CSPRNG state must be reseeded to prevent the parent and child from generating identical random sequences.
- Backtracking resistance (forward secrecy): compromise of current PRNG state should not reveal previously generated values. Modern CSPRNGs provide this through regular reseeding.

## Alternatives

| Name | Comparison |
|------|-----------|
| Hardware Random Number Generators (HRNGs/TRNGs) | Produce truly random values from physical phenomena (quantum effects, thermal noise). Slower than CSPRNGs and typically used to seed CSPRNGs rather than as direct sources of bulk random data. |
| Deterministic Random Bit Generators (DRBGs) | NIST SP 800-90A defines three DRBGs: Hash_DRBG, HMAC_DRBG, and CTR_DRBG. These are standardized CSPRNGs with formal security properties and reseeding mechanisms. |
| Quantum Random Number Generators | Generate randomness from quantum mechanical processes (photon detection, vacuum fluctuations). Provide information-theoretically random values but require specialized hardware. |

## References

- [NIST SP 800-90A: Recommendation for Random Number Generation Using Deterministic Random Bit Generators](https://csrc.nist.gov/publications/detail/sp/800-90a/rev-1/final)
- [RFC 4086: Randomness Requirements for Security](https://datatracker.ietf.org/doc/html/rfc4086)
- [Linux Random Number Generator — kernel.org Documentation](https://www.kernel.org/doc/html/latest/admin-guide/hw-vuln/speculative-execution.html)
