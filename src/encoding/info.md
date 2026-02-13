# Encoding

**Slug:** `encoding`
**Category:** Data Encoding

> Encoding transforms binary data into text-safe representations like Base64 and hexadecimal for safe transport across text-based protocols.

## Description

Encoding is the process of converting data from one format to another for safe transmission, storage, or human readability. Unlike encryption, encoding does not provide any security — it is a reversible transformation with no secret key. Anyone who knows the encoding scheme can decode the data.

The most common encoding schemes in cryptography and software engineering are Base64 and hexadecimal (Base16). Base64 encodes binary data into a set of 64 ASCII characters (A-Z, a-z, 0-9, +, /), expanding the data by approximately 33%. It is widely used to embed binary data (keys, certificates, images) in text-based formats like JSON, XML, email (MIME), and URLs. Base64url is a variant that replaces + and / with - and _ to be URL-safe.

Hexadecimal encoding represents each byte as two characters (0-9, a-f), doubling the data size but providing a directly human-readable representation of binary values. It is commonly used for displaying hash digests, encryption keys, and memory addresses.

Other encoding schemes include Base32 (used in TOTP), Base58 (used in Bitcoin addresses to avoid ambiguous characters), and ASN.1/DER/PEM (used for encoding cryptographic structures like certificates and keys).

## How It Works

1. **Base64:** The input bytes are split into groups of 3 bytes (24 bits), then divided into four 6-bit values. Each 6-bit value maps to one of 64 ASCII characters. Padding with `=` is added if the input length is not a multiple of 3.
2. **Hexadecimal:** Each input byte is converted to its two-character hexadecimal representation (e.g., byte 0xFF becomes `ff`).
3. **PEM:** Binary DER-encoded cryptographic structures are Base64-encoded and wrapped with header/footer lines (e.g., `-----BEGIN CERTIFICATE-----`).
4. **Base64url:** Same as Base64 but replaces `+` with `-` and `/` with `_`, and omits padding, making the output safe for use in URLs and filenames.
5. Decoding reverses the process exactly: the encoded text is mapped back to the original binary data using the same character-to-value table.

## Real-World Use Cases

- Embedding binary cryptographic keys and certificates in JSON Web Tokens (JWTs) and JSON Web Keys (JWKs) using Base64url.
- PEM-encoded X.509 certificates and private keys for TLS configuration.
- Displaying hash digests (SHA-256, MD5) as hexadecimal strings for verification.
- Email attachments encoded with Base64 in MIME format.
- Data URIs in HTML/CSS that embed images and fonts as Base64-encoded strings.

## Security Considerations

- Encoding is NOT encryption: Base64 and hex provide zero confidentiality. Sensitive data must be encrypted before encoding.
- Base64-encoded secrets in configuration files or environment variables are trivially decoded; this is not a security measure.
- Constant-time comparison should still be used when comparing encoded values (e.g., hex-encoded MACs) to prevent timing attacks.
- Malformed encoded input can cause buffer overflows or injection attacks in poorly written decoders; always validate input.
- Be aware of character set issues: some encodings may introduce characters that are interpreted specially in certain contexts (e.g., `+` in URLs).

## Alternatives

| Name | Comparison |
|------|-----------|
| Base58 | Used in Bitcoin addresses. Omits visually ambiguous characters (0, O, I, l) and special characters (+, /). Slightly less space-efficient than Base64 but more human-friendly. |
| Base32 | Uses 32 characters (A-Z, 2-7). Case-insensitive and avoids ambiguous characters. Used in TOTP secrets and onion addresses. Less space-efficient than Base64. |
| MessagePack / CBOR | Binary serialization formats that are more compact than text-based encodings. Used when efficiency matters more than human readability. |

## References

- [RFC 4648: The Base16, Base32, and Base64 Data Encodings](https://datatracker.ietf.org/doc/html/rfc4648)
- [RFC 7468: Textual Encodings of PKIX, PKCS, and CMS Structures (PEM)](https://datatracker.ietf.org/doc/html/rfc7468)
- [Base64 — Wikipedia](https://en.wikipedia.org/wiki/Base64)
