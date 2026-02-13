# Hybrid Encryption

**Slug:** `hybrid-encryption`
**Category:** Encryption Architecture

> Hybrid encryption combines asymmetric and symmetric cryptography, using a public key to encrypt a random symmetric key that in turn encrypts the actual data.

## Description

Hybrid encryption is a practical encryption approach that combines the best properties of asymmetric (public key) and symmetric encryption. Asymmetric algorithms like RSA and ECDH are excellent for key exchange and authentication but are computationally expensive and limited in the amount of data they can encrypt. Symmetric algorithms like AES-GCM are fast and can encrypt arbitrary amounts of data but require a pre-shared key.

Hybrid encryption solves this by using asymmetric cryptography to securely establish a shared symmetric key, and then using that symmetric key to encrypt the actual data. This approach is used in virtually every real-world encryption system: TLS, PGP, S/MIME, Signal Protocol, and SSH all use hybrid encryption.

In a typical hybrid encryption scheme: the sender generates a random symmetric key (session key), encrypts the data with this session key using an AEAD algorithm (e.g., AES-256-GCM), encrypts the session key with the recipient's public key (e.g., RSA-OAEP or ECIES), and sends both the encrypted session key and the encrypted data. Only the recipient, who holds the corresponding private key, can decrypt the session key and then the data.

## How It Works

1. The sender generates a random symmetric session key (e.g., a 256-bit AES key) using a cryptographically secure random number generator.
2. The sender encrypts the plaintext data using the session key with an AEAD algorithm (e.g., AES-256-GCM), producing ciphertext and an authentication tag.
3. The sender encrypts the session key using the recipient's public key (e.g., RSA-OAEP or ECIES/ECDH+HKDF).
4. The encrypted session key, ciphertext, authentication tag, and any necessary metadata (IV/nonce, algorithm identifiers) are bundled together and sent to the recipient.
5. The recipient uses their private key to decrypt the session key, then uses the session key to decrypt and authenticate the ciphertext.

## Real-World Use Cases

- TLS/HTTPS: the handshake uses ECDHE or RSA to establish a shared secret, from which symmetric session keys are derived for encrypting all subsequent traffic.
- PGP/GPG email encryption: a random session key encrypts the email body with AES, and the session key is encrypted with the recipient's RSA or ECC public key.
- Signal Protocol: X25519 key agreement produces a shared secret, which is used to derive AES-256-CBC or AES-256-GCM keys for message encryption.
- ECIES (Elliptic Curve Integrated Encryption Scheme): a standardized hybrid encryption scheme used in Ethereum and other systems.
- CMS (Cryptographic Message Syntax) and S/MIME use hybrid encryption for secure email and document encryption.

## Security Considerations

- The session key must be generated from a CSPRNG and must be unique per encryption operation.
- Both the asymmetric and symmetric components must be secure; the system's security is bounded by the weaker of the two.
- The asymmetric encryption of the session key must use proper padding (OAEP for RSA) or a secure KEM scheme.
- Forward secrecy requires ephemeral key pairs (ECDHE); static public keys don't provide forward secrecy.
- Key encapsulation mechanisms (KEMs) are increasingly preferred over direct public key encryption for the key exchange step, as they have cleaner security definitions.

## Alternatives

| Name | Comparison |
|------|-----------|
| Pure Symmetric Encryption | Requires a pre-shared key, which is difficult to establish securely. Faster but cannot solve the key distribution problem without a separate mechanism. |
| Pure Asymmetric Encryption | Eliminates the need for session keys but is too slow for bulk data and has message size limitations. Not practical for encrypting large payloads. |
| HPKE (Hybrid Public Key Encryption) | A modern standardized framework (RFC 9180) that provides a clean API for hybrid encryption with built-in KEM, KDF, and AEAD. Recommended for new implementations. |

## References

- [RFC 9180: Hybrid Public Key Encryption (HPKE)](https://datatracker.ietf.org/doc/html/rfc9180)
- [IEEE 1363a: Standard Specifications for Public-Key Cryptography (ECIES)](https://standards.ieee.org/standard/1363a-2004.html)
- [RFC 5652: Cryptographic Message Syntax (CMS)](https://datatracker.ietf.org/doc/html/rfc5652)
