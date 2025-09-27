# Cryptography

A NestJS application demonstrating various cryptographic concepts and operations.

## Description

This project implements practical examples of cryptographic concepts including hashing, salting, key pair generation, and symmetric/asymmetric encryption.

## Installation

```bash
yarn install
```

## Running the app

```bash
# development
yarn start:dev

# production mode
yarn start:prod
```

## API Endpoints

### Hashing
- `POST /app/hash/create` - Create a hash from input
- `POST /app/hash/compare` - Compare hashes
- `POST /app/hash/createhmac` - Create HMAC

### Key Pairs
- `GET /app/keypairs` - Get all key pairs
- `GET /app/keypairs/privatekeys` - Get private keys
- `GET /app/keypairs/publickeys` - Get public keys
- `GET /app/keypairs/signin` - Sign in with keys

### Encryption
- `GET /app/encryption/asymmetric` - Asymmetric encryption example
- `GET /app/encryption/symmetric` - Symmetric encryption example

### Salts
- `POST /app/salts/signup` - Sign up with salt
- `POST /app/salts/signin` - Sign in with salt

## Cryptographic Concepts Demonstrated

1. **Hashing** - One-way cryptographic functions
2. **Salt** - Random data used as additional input to hash functions
3. **Keypairs** - Public/private key cryptography
4. **Symmetric Encryption** - Same key for encryption and decryption
5. **Asymmetric Encryption** - Different keys for encryption and decryption
