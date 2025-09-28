# 🔐 Learn Cryptography

An educational NestJS application designed to make cryptography concepts **simple and accessible** for beginners. This repository provides hands-on examples and practical implementations to help newcomers understand how cryptographic security works in real-world applications.

## 🎯 Mission

**Making cryptography easy to understand for everyone.** This project breaks down complex security concepts into digestible, interactive examples that you can run, test, and learn from. Whether you're a student, developer, or just curious about how digital security works, this is your practical guide to cryptography fundamentals.

## 🧑‍🎓 Perfect For

- **Beginners** learning cryptography for the first time
- **Students** studying computer security or cryptography courses
- **Developers** wanting to understand security implementation
- **Anyone curious** about how digital security actually works
- **Educators** looking for practical teaching examples

## 🚀 Quick Start

### 1. Installation

```bash
git clone <this-repo>
cd cryptography
yarn install
```

### 2. Start Learning

```bash
# Start the interactive demo server
yarn start:dev

# Server runs on http://localhost:7000
```

### 3. Explore Concepts

Visit the demo endpoints to see cryptography in action! Each endpoint includes explanations and examples.

## API Endpoints

### Hashing

- `POST /hash/create` - Create a hash from input
- `POST /hash/compare` - Compare hashes
- `POST /hash/createhmac` - Create HMAC

### Key Pairs

- `GET /keypairs` - Get all key pairs
- `GET /keypairs/privatekeys` - Get private keys
- `GET /keypairs/publickeys` - Get public keys
- `GET /keypairs/signin` - Sign in with keys

### Encryption

- `GET /encryption/asymmetric` - Asymmetric encryption example
- `GET /encryption/symmetric` - Symmetric encryption example

### Salts

- `POST /salts/signup` - Sign up with salt
- `POST /salts/signin` - Sign in with salt

## Cryptographic Concepts Demonstrated

1. **Hashing** - One-way cryptographic functions
2. **Salt** - Random data used as additional input to hash functions
3. **Keypairs** - Public/private key cryptography
4. **Symmetric Encryption** - Same key for encryption and decryption
5. **Asymmetric Encryption** - Different keys for encryption and decryption
