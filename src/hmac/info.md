# HMAC

**Slug:** `hmac`
**Category:** Message Authentication

> HMAC (Hash-based Message Authentication Code) uses a cryptographic hash function and a secret key to produce a message authentication code that verifies both integrity and authenticity.

## Description

HMAC (Hash-based Message Authentication Code) is a mechanism for computing a message authentication code (MAC) using a cryptographic hash function combined with a secret key. Defined in RFC 2104, HMAC provides both data integrity (detecting modifications) and authentication (verifying the sender) for messages.

HMAC works by applying the hash function twice with the key mixed in via XOR with specific padding values (ipad and opad). This construction, HMAC(K, m) = H((K ^ opad) || H((K ^ ipad) || m)), is provably secure as long as the underlying hash function has certain properties — specifically, it remains secure even if the hash function is not collision-resistant, relying only on the PRF property of the compression function.

HMAC can be instantiated with any cryptographic hash function: HMAC-SHA256, HMAC-SHA384, HMAC-SHA512, etc. It is one of the most widely used MAC constructions in practice, serving as a building block in TLS, IPsec, SSH, JWT, HKDF, and many API authentication schemes. HMAC is distinct from digital signatures in that it uses symmetric (shared) keys — both the sender and receiver must possess the same secret key.

## How It Works

1. The secret key is padded or hashed to match the hash function's block size (e.g., 64 bytes for SHA-256).
2. The inner hash is computed: H((K ^ ipad) || message), where ipad is 0x36 repeated to the block size.
3. The outer hash is computed: H((K ^ opad) || inner_hash), where opad is 0x5C repeated to the block size.
4. The resulting HMAC tag (the outer hash output) is sent alongside the message.
5. The receiver computes the HMAC over the received message using the shared secret key and compares it (in constant time) to the received tag. A match confirms both integrity and authenticity.

## Real-World Use Cases

- API authentication: services like AWS use HMAC-SHA256 to sign API requests, proving the caller possesses the secret key.
- JWT (JSON Web Token) signing using HS256 (HMAC-SHA256), HS384, or HS512 algorithms.
- TLS record layer uses HMAC for message authentication in cipher suites that don't use AEAD.
- HKDF uses HMAC as its core primitive for key extraction and expansion.
- TOTP/HOTP one-time passwords use HMAC-SHA1 to generate time-based or counter-based authentication codes.

## Security Considerations

- HMAC verification must use constant-time comparison to prevent timing attacks that could leak information about the correct tag byte by byte.
- The secret key should be at least as long as the hash output (e.g., 256 bits for HMAC-SHA256) and generated from a CSPRNG.
- HMAC does not provide non-repudiation: since both parties share the key, either could have generated the MAC. Use digital signatures if non-repudiation is needed.
- Truncating the HMAC output reduces forgery resistance proportionally; truncated tags should be at least 128 bits.
- HMAC is secure even with hash functions vulnerable to length-extension attacks (SHA-256), because the double-hashing construction prevents extension.

## Alternatives

| Name | Comparison |
|------|-----------|
| CMAC (Cipher-based MAC) | Uses a block cipher (AES) instead of a hash function. Provides similar security guarantees. Preferred in environments where AES hardware is available but hash hardware is not. |
| Poly1305 | A one-time authenticator that is faster than HMAC but requires a unique key per message. Used in combination with ChaCha20 or AES for AEAD constructions. |
| Digital Signatures (RSA, ECDSA, EdDSA) | Asymmetric authentication that provides non-repudiation (the signer cannot deny signing). More expensive computationally and uses public/private key pairs instead of shared secrets. |

## References

- [RFC 2104: HMAC — Keyed-Hashing for Message Authentication](https://datatracker.ietf.org/doc/html/rfc2104)
- [NIST FIPS 198-1: The Keyed-Hash Message Authentication Code (HMAC)](https://csrc.nist.gov/publications/detail/fips/198/1/final)
- [RFC 6234: US Secure Hash Algorithms (SHA and SHA-based HMAC and HKDF)](https://datatracker.ietf.org/doc/html/rfc6234)
