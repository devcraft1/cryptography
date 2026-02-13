# AES-GCM

**Slug:** `aes-gcm`
**Category:** Authenticated Encryption

> AES-GCM is an authenticated encryption algorithm that provides both confidentiality and integrity using the Advanced Encryption Standard in Galois/Counter Mode.

## Description

AES-GCM (Advanced Encryption Standard in Galois/Counter Mode) is one of the most widely used authenticated encryption with associated data (AEAD) algorithms. It combines the AES block cipher operating in Counter (CTR) mode for encryption with Galois mode for authentication, providing both confidentiality and data integrity in a single operation.

Unlike encryption-only modes such as AES-CBC, AES-GCM produces an authentication tag alongside the ciphertext. This tag ensures that any tampering with the ciphertext or associated data (such as headers or metadata) is detected during decryption, preventing a broad class of attacks including chosen-ciphertext attacks.

AES-GCM supports key sizes of 128, 192, and 256 bits, with AES-256-GCM being the most common choice for high-security applications. It requires a unique initialization vector (IV/nonce) for each encryption operation under the same key — reusing a nonce completely breaks the security guarantees of the scheme.

## How It Works

1. A unique 96-bit nonce (initialization vector) is generated for each encryption operation.
2. The plaintext is encrypted using AES in Counter (CTR) mode, producing ciphertext of the same length as the input.
3. Simultaneously, a Galois field multiplication-based authentication function (GHASH) computes an authentication tag over the ciphertext and any additional authenticated data (AAD).
4. The resulting output consists of the nonce, ciphertext, and a 128-bit authentication tag.
5. During decryption, the authentication tag is verified first; if it does not match, the decryption is rejected and no plaintext is released.

## Real-World Use Cases

- TLS 1.3 uses AES-GCM as a mandatory cipher suite for securing web traffic.
- Encrypting data at rest in cloud storage services like AWS S3 and Google Cloud Storage.
- VPN protocols (IPsec, WireGuard) use AES-GCM for encrypting tunnel traffic.
- Full-disk encryption in hardware-accelerated storage controllers.
- Securing API payloads and inter-service communication in microservice architectures.

## Security Considerations

- Nonce reuse is catastrophic: reusing a nonce with the same key reveals the XOR of two plaintexts and allows authentication key recovery.
- The maximum amount of data encrypted under a single key should be limited to approximately 64 GB to maintain security margins.
- AES-GCM does not provide protection against key-commitment attacks; consider AES-GCM-SIV or alternatives if this is a concern.
- The authentication tag should be at least 128 bits for full security; truncated tags reduce forgery resistance.
- AES-GCM is vulnerable to timing side-channel attacks if the GHASH implementation does not use constant-time operations.

## Alternatives

| Name | Comparison |
|------|-----------|
| ChaCha20-Poly1305 | A software-friendly AEAD alternative that performs better on platforms without AES hardware acceleration. Provides equivalent security with different performance characteristics. |
| AES-GCM-SIV | A nonce-misuse-resistant variant that remains secure even if nonces are accidentally reused, at the cost of slightly reduced performance. |
| AES-CCM | Another AEAD mode using AES that combines CTR mode with CBC-MAC. Simpler but slower than GCM since encryption and authentication are sequential. |

## References

- [NIST SP 800-38D: Recommendation for Block Cipher Modes of Operation: Galois/Counter Mode (GCM)](https://csrc.nist.gov/publications/detail/sp/800-38d/final)
- [RFC 5116: An Interface and Algorithms for Authenticated Encryption](https://datatracker.ietf.org/doc/html/rfc5116)
- [RFC 5288: AES Galois Counter Mode (GCM) Cipher Suites for TLS](https://datatracker.ietf.org/doc/html/rfc5288)
