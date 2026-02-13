# Cryptographic Salts

**Slug:** `cryptographic-salts`
**Category:** Cryptographic Primitives

> Cryptographic salts are random values added to inputs before hashing or key derivation, ensuring that identical inputs produce unique outputs and defeating precomputation attacks.

## Description

A cryptographic salt is a random value that is combined with an input (typically a password) before hashing or key derivation. The primary purpose of salting is to ensure that identical inputs produce different outputs, even when processed with the same hash function. This defeats rainbow table attacks (precomputed hash-to-password lookup tables) and prevents an attacker who obtains a database of hashed passwords from identifying users with the same password.

Salts are not secret — they are stored alongside the hash output in plaintext. Their security contribution comes from forcing the attacker to compute each hash individually rather than using precomputed tables. A unique salt per password means an attacker must crack each password independently, turning a table-lookup attack into a per-password brute-force attack.

Salts should be generated using a cryptographically secure random number generator and should be at least 128 bits (16 bytes) long to prevent collisions. They are a required component of all modern password hashing schemes (Argon2, bcrypt, scrypt, PBKDF2) and are used in other contexts like HKDF key derivation and certain signature schemes.

## How It Works

1. A unique random salt (at least 128 bits) is generated using a CSPRNG for each password or input to be hashed.
2. The salt is combined with the input, typically by concatenation or by passing it as a separate parameter to the hash/KDF function.
3. The hash or key derivation function processes the salted input, producing a hash output that depends on both the input and the salt.
4. The salt is stored in plaintext alongside the hash output (e.g., in the format `$algorithm$salt$hash` in /etc/shadow, or in structured fields in a database).
5. During verification, the stored salt is retrieved, combined with the candidate input, and the hash is recomputed for comparison.

## Real-World Use Cases

- Password storage: every user's password is hashed with a unique salt, so two users with the same password have different hash values.
- PBKDF2, bcrypt, scrypt, and Argon2 all require a salt parameter to derive keys from passwords.
- HKDF uses an optional salt in the extract phase to improve the distribution of the derived pseudorandom key.
- Unix/Linux password storage (/etc/shadow) includes a per-user salt in the hash field.
- Key diversification in payment card systems: a master key is combined with card-specific data (acting as a salt) to derive unique per-card keys.

## Security Considerations

- Each input must have a unique salt; reusing salts across inputs negates their benefit against precomputation and multi-target attacks.
- Salts must be generated from a CSPRNG, not derived from predictable values like user IDs, timestamps, or sequential counters.
- Salt length should be at least 128 bits (16 bytes) to make collisions negligible. NIST recommends at least 128 bits.
- Salts are NOT a substitute for slow hashing; they complement password hashing functions by preventing precomputation, while iteration counts provide brute-force resistance.
- Salts do not need to be secret (they are not "pepper"). A pepper is an additional secret value stored separately from the hash database for defense in depth.

## Alternatives

| Name | Comparison |
|------|-----------|
| Pepper | A secret value (unlike a salt) that is combined with the password before hashing and stored separately from the hash database (e.g., in an HSM or environment variable). Adds defense in depth but complicates key management. |
| Nonce | A "number used once" in encryption contexts. Similar to a salt in that it ensures uniqueness, but nonces are used with encryption algorithms rather than hashing. Some nonces must be sequential rather than random. |
| Key Stretching (without salt) | Applying many iterations of a hash function to a password. Slows down brute-force attacks but without a salt, identical passwords produce identical outputs and are vulnerable to precomputation. |

## References

- [NIST SP 800-132: Recommendation for Password-Based Key Derivation](https://csrc.nist.gov/publications/detail/sp/800-132/final)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [RFC 8018: PKCS #5 — Password-Based Cryptography Specification Version 2.1](https://datatracker.ietf.org/doc/html/rfc8018)
