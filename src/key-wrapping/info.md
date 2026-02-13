# Key Wrapping

**Slug:** `key-wrapping`
**Category:** Key Management

> Key wrapping algorithms securely encrypt cryptographic keys for storage or transport, providing confidentiality and integrity protection specifically designed for key material.

## Description

Key wrapping is a specialized form of encryption designed specifically for protecting cryptographic keys. Unlike general-purpose encryption, key wrapping algorithms are optimized for encrypting small, high-value payloads (symmetric keys) and provide both confidentiality and integrity without requiring a separate IV or nonce.

The most widely used key wrapping algorithm is AES Key Wrap (AES-KW), defined in RFC 3394. It uses AES in a deterministic mode with a built-in integrity check value (ICV), ensuring that any tampering with the wrapped key is detected during unwrapping. AES-KWP (Key Wrap with Padding, RFC 5649) extends this to support payloads that are not multiples of 8 bytes.

Key wrapping is a critical component of key management systems and envelope encryption architectures. In these systems, data encryption keys (DEKs) are wrapped by key encryption keys (KEKs), allowing the KEKs to be stored in hardware security modules (HSMs) while the wrapped DEKs can be stored alongside encrypted data. Key wrapping is also used in protocols like CMS, JWE, and XML Encryption for secure key transport.

## How It Works

1. AES-KW takes a Key Encryption Key (KEK) and the plaintext key to be wrapped as input. No IV or nonce is needed — a fixed initial value (0xA6A6A6A6A6A6A6A6) serves as the integrity check.
2. The plaintext key is split into 64-bit blocks, and a series of AES encryption operations are applied in a specific wrapping pattern (six rounds of transformations over all blocks).
3. Each round XORs a round counter into the output and applies AES encryption, mixing the blocks together.
4. The output is the wrapped key, which is 8 bytes longer than the input (due to the integrity check value).
5. Unwrapping reverses the process and verifies the integrity check value. If the ICV doesn't match the expected value, the unwrap fails, indicating tampering.

## Real-World Use Cases

- Envelope encryption in cloud KMS (AWS KMS, Google Cloud KMS): DEKs are wrapped by KEKs stored in HSMs.
- JWE (JSON Web Encryption) uses AES-KW (A128KW, A256KW) to wrap content encryption keys in JWT-based systems.
- XML Encryption uses AES-KW for wrapping symmetric keys in XML-based security protocols (SOAP, SAML).
- PKCS#11 (Cryptoki) HSM interfaces use key wrapping to export keys from hardware security modules in encrypted form.
- Key escrow and backup systems wrap keys before storing them to ensure they remain protected at rest.

## Security Considerations

- AES-KW is deterministic: the same plaintext key wrapped with the same KEK always produces the same output. This is by design for key material but would be inappropriate for general data encryption.
- The KEK must be at least as strong as the keys being wrapped; wrapping a 256-bit key with a 128-bit KEK provides only 128 bits of security.
- Wrapped keys should be treated as sensitive material even though they are encrypted, as they represent high-value targets.
- Key wrapping does not hide the length of the wrapped key; the output length reveals the input length.
- AES-KW input must be a multiple of 8 bytes; use AES-KWP for arbitrary-length key material.

## Alternatives

| Name | Comparison |
|------|-----------|
| AES-GCM for Key Encryption | Can be used to encrypt keys with authenticated encryption. Requires a nonce (unlike AES-KW) but provides the same security properties. Used in some JWE algorithms (A128GCMKW). |
| RSA-OAEP Key Transport | Uses asymmetric encryption to wrap a symmetric key for transport. The recipient's public key encrypts the session key, enabling key exchange without a pre-shared KEK. |
| HPKE Key Encapsulation | A modern key encapsulation mechanism that combines key agreement (ECDH) with key wrapping. Provides a cleaner API and is the recommended approach for new protocols. |

## References

- [RFC 3394: Advanced Encryption Standard (AES) Key Wrap Algorithm](https://datatracker.ietf.org/doc/html/rfc3394)
- [RFC 5649: Advanced Encryption Standard (AES) Key Wrap with Padding Algorithm](https://datatracker.ietf.org/doc/html/rfc5649)
- [NIST SP 800-38F: Recommendation for Block Cipher Modes of Operation: Methods for Key Wrapping](https://csrc.nist.gov/publications/detail/sp/800-38f/final)
