# HKDF

**Slug:** `hkdf`
**Category:** Key Derivation

> HKDF (HMAC-based Key Derivation Function) extracts and expands cryptographic key material from a source of entropy into one or more strong keys.

## Description

HKDF (HMAC-based Extract-and-Expand Key Derivation Function) is a simple yet powerful key derivation function defined in RFC 5869. It uses HMAC as its core building block and operates in two stages: extract and expand.

The extract stage takes potentially non-uniform input key material (IKM) — such as the output of a Diffie-Hellman exchange — and produces a fixed-length pseudorandom key (PRK). This step concentrates the entropy from the IKM into a uniformly distributed key. The expand stage takes the PRK and produces one or more output keys of any desired length, using an optional context-specific "info" parameter to derive distinct keys for different purposes.

HKDF is the standard key derivation function used in TLS 1.3, Signal Protocol, Noise Framework, and many other modern cryptographic systems. Its design is provably secure in the random oracle model, and its simplicity makes it less error-prone than ad-hoc key derivation approaches. HKDF should be used whenever you need to derive symmetric keys from shared secrets, not for password hashing (use Argon2, bcrypt, or scrypt for that).

## How It Works

1. **Extract phase:** HKDF-Extract takes an optional salt and the input key material (IKM), and computes PRK = HMAC-Hash(salt, IKM). If no salt is provided, a string of zeroes is used.
2. The PRK (pseudorandom key) is a fixed-length value that concentrates the entropy of the IKM into a uniformly random key.
3. **Expand phase:** HKDF-Expand takes the PRK, an info string (application-specific context), and desired output length L.
4. The expand phase iteratively computes T(i) = HMAC-Hash(PRK, T(i-1) || info || i) until enough key material is generated.
5. Multiple independent keys can be derived from the same PRK by using different info strings, ensuring cryptographic separation between derived keys.

## Real-World Use Cases

- TLS 1.3 uses HKDF to derive all session keys, IVs, and authentication secrets from the handshake shared secret.
- Signal Protocol derives message keys, chain keys, and root keys using HKDF in the Double Ratchet algorithm.
- Deriving separate encryption and MAC keys from a single Diffie-Hellman shared secret.
- Generating multiple application-specific keys from a single master secret in key management systems.
- WireGuard uses HKDF to derive session keys from the Noise handshake output.

## Security Considerations

- HKDF is NOT a password hashing function; it is fast by design. For passwords, use Argon2, bcrypt, or scrypt.
- The salt in the extract phase improves security by ensuring different salts produce different PRKs even from the same IKM, but it is optional.
- The info parameter in the expand phase MUST include context that uniquely identifies the purpose of each derived key to prevent key reuse across contexts.
- The maximum output length is 255 * hash_length bytes (e.g., 8,160 bytes for HKDF-SHA-256).
- If the IKM is already a uniformly random key (e.g., from a CSPRNG), the extract step can be skipped using HKDF-Expand directly.

## Alternatives

| Name | Comparison |
|------|-----------|
| PBKDF2 | A password-based key derivation function that applies HMAC iteratively. Slower than HKDF by design (configurable iterations) but not memory-hard. Suitable for passwords; HKDF is better for non-password key material. |
| Argon2 | A modern password hashing function that is both computationally and memory-hard. Designed specifically for password-to-key derivation, not general-purpose key derivation. |
| NIST SP 800-108 KDF | A family of KDFs in counter, feedback, and pipeline modes. More complex than HKDF and used primarily in standards compliance contexts. |

## References

- [RFC 5869: HMAC-based Extract-and-Expand Key Derivation Function (HKDF)](https://datatracker.ietf.org/doc/html/rfc5869)
- [Hugo Krawczyk — Cryptographic Extraction and Key Derivation: The HKDF Scheme](https://eprint.iacr.org/2010/264)
- [RFC 8446: The Transport Layer Security (TLS) Protocol Version 1.3 (HKDF usage)](https://datatracker.ietf.org/doc/html/rfc8446)
