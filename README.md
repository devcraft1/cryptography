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
| GET | `/encryption/symmetric` | AES-256 symmetric encryption demo |

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

## Project Structure

```
src/
├── app.module.ts              # Root module (imports feature modules)
├── app.controller.ts          # Root info & health endpoints
├── main.ts                    # Application entry point
├── hashing/                   # SHA-256 hashing
├── key-pair/                  # RSA keypair generation
├── encryption/                # Symmetric & asymmetric encryption
├── salts/                     # Password salting
├── hmac/                      # HMAC generation & verification
├── digital-signatures/        # Digital signature operations
├── key-derivation/            # PBKDF2 & Scrypt key derivation
└── post-quantum/              # ML-KEM, ML-DSA, SLH-DSA
```

## Testing

```bash
# Unit tests (155 tests)
npm test

# End-to-end tests
npm run test:e2e
```
