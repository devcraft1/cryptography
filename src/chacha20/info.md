# ChaCha20-Poly1305

**Slug:** `chacha20-poly1305`
**Category:** Authenticated Encryption

> ChaCha20-Poly1305 is an authenticated encryption algorithm combining the ChaCha20 stream cipher with the Poly1305 message authentication code, designed for high performance in software.

## Description

ChaCha20-Poly1305 is an AEAD (Authenticated Encryption with Associated Data) construction that pairs the ChaCha20 stream cipher, designed by Daniel J. Bernstein, with the Poly1305 one-time authenticator. It provides both confidentiality and integrity guarantees in a single, efficient operation.

ChaCha20 is a refinement of the earlier Salsa20 cipher, using a series of quarter-round operations (additions, XORs, and rotations — collectively called ARX) on a 4x4 matrix of 32-bit words. This design makes it extremely fast in pure software implementations, particularly on platforms that lack dedicated AES hardware instructions (AES-NI).

Poly1305 computes a one-time message authentication code using modular arithmetic over a prime field. When combined with ChaCha20 (which generates the one-time Poly1305 key), the construction provides strong authentication that detects any modification to the ciphertext or associated data.

ChaCha20-Poly1305 has been adopted as a mandatory cipher suite in TLS 1.3, is used by default in WireGuard, and is the primary cipher in the Noise protocol framework.

## How It Works

1. A 256-bit key and a 96-bit nonce are used to initialize ChaCha20's internal state matrix.
2. The first 32 bytes of the ChaCha20 keystream (block 0) are used as the one-time Poly1305 key.
3. Subsequent ChaCha20 keystream blocks are XORed with the plaintext to produce the ciphertext.
4. Poly1305 computes an authentication tag over the associated data (AAD), ciphertext, and their respective lengths.
5. The output is the nonce, ciphertext, and 128-bit Poly1305 tag. Decryption verifies the tag before releasing any plaintext.

## Real-World Use Cases

- TLS 1.3 cipher suite for securing HTTPS traffic, especially on mobile and embedded devices.
- WireGuard VPN protocol uses ChaCha20-Poly1305 as its sole symmetric cipher.
- SSH (OpenSSH) supports chacha20-poly1305@openssh.com as a transport cipher.
- Noise protocol framework (used by Signal, WhatsApp, Lightning Network) defaults to ChaCha20-Poly1305.
- Android and iOS disk encryption on devices without AES hardware acceleration.

## Security Considerations

- Like AES-GCM, nonce reuse with the same key is catastrophic and must be prevented through careful nonce management.
- The XChaCha20 variant extends the nonce to 192 bits, making random nonce generation safe and eliminating nonce-reuse concerns in practice.
- ChaCha20-Poly1305 has a higher per-message data limit (~256 GB) compared to AES-GCM (~64 GB).
- The algorithm has no known practical attacks; its security margin (20 rounds) is considered very conservative.
- Unlike AES, ChaCha20 does not benefit from hardware acceleration on most x86 platforms, though it is faster in pure software.

## Alternatives

| Name | Comparison |
|------|-----------|
| AES-GCM | The most common AEAD alternative. Faster than ChaCha20-Poly1305 on hardware with AES-NI but slower in pure software. Both provide equivalent 256-bit security. |
| XChaCha20-Poly1305 | An extended-nonce variant using a 192-bit nonce, allowing safe random nonce generation. Recommended when nonce management is difficult. |
| AES-SIV | A nonce-misuse-resistant AEAD mode that remains secure even with nonce reuse, at the cost of requiring two passes over the data. |

## References

- [RFC 8439: ChaCha20 and Poly1305 for IETF Protocols](https://datatracker.ietf.org/doc/html/rfc8439)
- [Daniel J. Bernstein — ChaCha, a Variant of Salsa20](https://cr.yp.to/chacha/chacha-20080128.pdf)
- [RFC 7905: ChaCha20-Poly1305 Cipher Suites for TLS](https://datatracker.ietf.org/doc/html/rfc7905)
