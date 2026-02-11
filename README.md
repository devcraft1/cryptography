# Learn Cryptography

An educational NestJS application designed to make cryptography concepts **simple and accessible** for beginners. This repository provides hands-on examples and practical implementations to help newcomers understand how cryptographic security works in real-world applications.

## Mission

**Making cryptography easy to understand for everyone.** This project breaks down complex security concepts into digestible, interactive examples that you can run, test, and learn from. Whether you're a student, developer, or just curious about how digital security works, this is your practical guide to cryptography fundamentals.

## Perfect For

- **Beginners** learning cryptography for the first time
- **Students** studying computer security or cryptography courses
- **Developers** wanting to understand security implementation
- **Anyone curious** about how digital security actually works
- **Educators** looking for practical teaching examples

## Quick Start

### 1. Installation

```bash
git clone <this-repo>
cd cryptography
npm install
```

### 2. Start Learning

```bash
# Start the interactive demo server
npm run start:dev

# Server runs on http://localhost:7000
```

### 3. Explore Concepts

Visit the demo endpoints to see cryptography in action! Each endpoint includes explanations and examples.

## API Endpoints

### Root

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info and feature listing |
| GET | `/health` | Health check |

### Hashing (`/hash`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/hash/create` | Create a SHA-256 hash from input |
| POST | `/hash/compare` | Compare two hashes |
| POST | `/hash/createhmac` | Create an HMAC |

### Key Pairs (`/keypairs`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/keypairs` | Get all key pairs |
| GET | `/keypairs/privatekeys` | Get private key |
| GET | `/keypairs/publickeys` | Get public key |
| GET | `/keypairs/signin` | Sign in with keys |

### Encryption (`/encryption`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/encryption/asymmetric` | RSA asymmetric encryption demo |
| GET | `/encryption/symmetric` | AES-256-CBC symmetric encryption demo |

### Salts (`/salts`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/salts/signup` | Sign up with salted password |
| POST | `/salts/signin` | Sign in with salted password |

### HMAC (`/hmac`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/hmac/generate` | Generate an HMAC for a message |
| POST | `/hmac/verify` | Verify an HMAC |
| GET | `/hmac/demo` | Interactive HMAC demonstration |

### Digital Signatures (`/signatures`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signatures/sign` | Sign a message |
| POST | `/signatures/verify` | Verify a signature |
| GET | `/signatures/demo` | Digital signature demo with tampering detection |
| GET | `/signatures/keypair` | Generate an RSA signing keypair |

### Key Derivation (`/kdf`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/kdf/pbkdf2` | Derive a key using PBKDF2 |
| POST | `/kdf/scrypt` | Derive a key using Scrypt |
| GET | `/kdf/demo` | KDF demonstration (PBKDF2 + Scrypt) |
| POST | `/kdf/verify` | Verify a derived password |

### Post-Quantum Cryptography (`/pqc`)

#### ML-KEM (Key Encapsulation)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/pqc/kem/demo` | ML-KEM key exchange demonstration |
| POST | `/pqc/kem/keygen` | Generate ML-KEM keypair |
| POST | `/pqc/kem/encapsulate` | Encapsulate a shared secret |
| POST | `/pqc/kem/decapsulate` | Decapsulate a shared secret |

#### ML-DSA (Digital Signatures)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/pqc/dsa/demo` | ML-DSA signature demonstration |
| POST | `/pqc/dsa/keygen` | Generate ML-DSA keypair |
| POST | `/pqc/dsa/sign` | Sign a message with ML-DSA |
| POST | `/pqc/dsa/verify` | Verify an ML-DSA signature |

#### SLH-DSA (Stateless Hash-Based Signatures)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/pqc/slh/demo` | SLH-DSA signature demonstration |
| POST | `/pqc/slh/keygen` | Generate SLH-DSA keypair |
| POST | `/pqc/slh/sign` | Sign a message with SLH-DSA |
| POST | `/pqc/slh/verify` | Verify an SLH-DSA signature |

### Encoding (`/encoding`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/encoding/base64/encode` | Encode text to Base64 |
| POST | `/encoding/base64/decode` | Decode Base64 to text |
| POST | `/encoding/hex/encode` | Encode text to hexadecimal |
| POST | `/encoding/hex/decode` | Decode hexadecimal to text |
| POST | `/encoding/url/encode` | URL-encode a string |
| POST | `/encoding/url/decode` | URL-decode a string |
| GET | `/encoding/demo` | Demonstrates that encoding is NOT encryption |

### Secure Random (`/random`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/random/bytes` | Generate cryptographically secure random bytes |
| GET | `/random/uuid` | Generate a UUID v4 |
| POST | `/random/integer` | Generate a secure random integer in range |
| GET | `/random/demo` | CSPRNG demonstration |

### AES-GCM Authenticated Encryption (`/aes-gcm`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/aes-gcm/encrypt` | Encrypt with AES-256-GCM (returns ciphertext + auth tag) |
| POST | `/aes-gcm/decrypt` | Decrypt and verify authenticity |
| GET | `/aes-gcm/demo` | Demonstrates encryption + tamper detection |

### Diffie-Hellman Key Exchange (`/dh`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dh/classic` | Classic Diffie-Hellman key exchange |
| POST | `/dh/ecdh` | Elliptic Curve Diffie-Hellman key exchange |
| GET | `/dh/demo` | ECDH demonstration |

### Elliptic Curve Cryptography (`/ecc`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ecc/keygen` | Generate EC keypair (P-256, P-384, etc.) |
| POST | `/ecc/sign` | Sign a message with ECDSA |
| POST | `/ecc/verify` | Verify an ECDSA signature |
| GET | `/ecc/demo` | ECDSA demonstration with tamper detection |

### One-Time Passwords (`/otp`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/otp/secret` | Generate a shared secret for OTP |
| POST | `/otp/hotp/generate` | Generate HMAC-based OTP (RFC 4226) |
| POST | `/otp/hotp/verify` | Verify an HOTP code |
| POST | `/otp/totp/generate` | Generate time-based OTP (RFC 6238) |
| POST | `/otp/totp/verify` | Verify a TOTP code |
| GET | `/otp/demo` | HOTP and TOTP demonstration |

### X.509 Certificates (`/certificates`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/certificates/create` | Create a self-signed certificate |
| POST | `/certificates/verify` | Verify a certificate signature |
| GET | `/certificates/demo` | Certificate creation, verification, and tamper detection |

### Shamir's Secret Sharing (`/secret-sharing`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/secret-sharing/split` | Split a secret into N shares (K required to reconstruct) |
| POST | `/secret-sharing/combine` | Reconstruct a secret from K shares |
| GET | `/secret-sharing/demo` | Demonstrates split and reconstruct with different share subsets |

### JSON Web Tokens (`/jwt`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/jwt/sign/hs256` | Sign a JWT with HMAC-SHA256 |
| POST | `/jwt/sign/rs256` | Sign a JWT with RSA-SHA256 |
| POST | `/jwt/verify` | Verify a JWT token |
| POST | `/jwt/decode` | Decode a JWT without verification |
| GET | `/jwt/demo` | Demonstrates HS256, RS256, and tamper detection |

## Cryptographic Concepts Demonstrated

1. **Hashing** - One-way cryptographic functions (SHA-256)
2. **Salts** - Random data used as additional input to hash functions
3. **Key Pairs** - Public/private key cryptography (RSA 2048-bit)
4. **Symmetric Encryption** - Same key for encryption and decryption (AES-256-CBC)
5. **Asymmetric Encryption** - Different keys for encryption and decryption (RSA)
6. **HMAC** - Hash-based Message Authentication Codes with timing-safe verification
7. **Digital Signatures** - RSA-based message signing and verification with tampering detection
8. **Key Derivation** - Password-based key derivation (PBKDF2, Scrypt)
9. **Post-Quantum Cryptography** - Quantum-resistant algorithms (ML-KEM, ML-DSA, SLH-DSA)
10. **Encoding vs Encryption** - Base64, Hex, URL encoding (not security!)
11. **Secure Random Generation** - CSPRNG, UUIDs, and why Math.random() is unsafe
12. **Authenticated Encryption** - AES-256-GCM with integrity verification
13. **Diffie-Hellman Key Exchange** - Shared secret agreement over insecure channels
14. **Elliptic Curve Cryptography** - ECDSA signatures with smaller, faster keys
15. **One-Time Passwords** - HOTP (RFC 4226) and TOTP (RFC 6238) for 2FA
16. **X.509 Certificates** - Digital identity, self-signed certs, chain of trust
17. **Shamir's Secret Sharing** - Split secrets into shares using GF(256) polynomial interpolation
18. **JSON Web Tokens** - JWT signing (HS256/RS256), verification, and structure

## Project Structure

```
src/
├── app.module.ts              # Root module (imports 17 feature modules)
├── app.controller.ts          # Root info & health endpoints
├── main.ts                    # Application entry point
├── hashing/                   # SHA-256 hashing
├── key-pair/                  # RSA keypair generation
├── encryption/                # Symmetric & asymmetric encryption
├── salts/                     # Password salting
├── hmac/                      # HMAC generation & verification
├── digital-signatures/        # Digital signature operations
├── key-derivation/            # PBKDF2 & Scrypt key derivation
├── post-quantum/              # ML-KEM, ML-DSA, SLH-DSA
├── encoding/                  # Base64, Hex, URL encoding
├── random/                    # CSPRNG, UUID, secure random
├── aes-gcm/                   # Authenticated encryption (AES-GCM)
├── diffie-hellman/            # DH & ECDH key exchange
├── ecc/                       # Elliptic curve cryptography (ECDSA)
├── otp/                       # HOTP & TOTP one-time passwords
├── certificates/              # X.509 certificate concepts
├── secret-sharing/            # Shamir's Secret Sharing (GF(256))
└── jwt/                       # JSON Web Token sign/verify/decode
```

## Testing

```bash
# Unit tests (236 tests)
npm test

# End-to-end tests (40 tests)
npm run test:e2e
```
