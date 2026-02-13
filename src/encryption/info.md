# RSA Encryption

**Slug:** `rsa-encryption`
**Category:** Asymmetric Encryption

> RSA is a public key cryptosystem that enables encryption and digital signatures based on the mathematical difficulty of factoring the product of two large prime numbers.

## Description

RSA (Rivest-Shamir-Adleman) is one of the first public key cryptosystems and remains widely used for secure data transmission. Published in 1977, RSA's security is based on the practical difficulty of factoring the product of two large prime numbers (the factoring problem). It supports both encryption (anyone can encrypt with the public key; only the private key holder can decrypt) and digital signatures (the private key holder signs; anyone can verify with the public key).

RSA key generation involves selecting two large random primes p and q, computing their product n = p * q (the modulus), computing Euler's totient phi(n) = (p-1)(q-1), choosing a public exponent e (commonly 65537), and computing the private exponent d such that e * d = 1 (mod phi(n)). The public key is (n, e) and the private key is (n, d).

Direct RSA encryption (textbook RSA) is insecure; practical implementations use padding schemes. OAEP (Optimal Asymmetric Encryption Padding) is the recommended padding for encryption, while PSS (Probabilistic Signature Scheme) is recommended for signatures. RSA is computationally expensive compared to symmetric algorithms, so in practice it is used to encrypt small amounts of data — typically symmetric keys or hash digests — in hybrid encryption schemes.

## How It Works

1. Two large random primes p and q are generated (typically 1024 bits each for RSA-2048). The modulus n = p * q is computed.
2. The public exponent e (usually 65537) and private exponent d are computed such that e * d = 1 (mod phi(n)).
3. The public key (n, e) is shared openly. The private key (n, d) is kept secret. The primes p and q are discarded or stored securely for CRT optimization.
4. To encrypt a message m: the sender computes ciphertext c = m^e mod n using the recipient's public key.
5. To decrypt: the recipient computes m = c^d mod n using their private key. In practice, OAEP padding is applied before encryption and removed after decryption.

## Real-World Use Cases

- TLS key exchange in older cipher suites where the client encrypts the pre-master secret with the server's RSA public key.
- PGP/GPG email encryption where RSA encrypts the symmetric session key.
- Code signing and software update verification using RSA signatures.
- Smart card and hardware security module (HSM) operations where RSA keys are stored in tamper-resistant hardware.
- XML Encryption and SOAP message security in enterprise web services.

## Security Considerations

- RSA key sizes must be at least 2048 bits; 4096 bits is recommended for long-term security. 1024-bit RSA is considered broken.
- Textbook RSA (no padding) is completely insecure; always use OAEP for encryption and PSS for signatures.
- PKCS#1 v1.5 padding for encryption is vulnerable to Bleichenbacher's chosen-ciphertext attack and should be avoided.
- RSA is vulnerable to quantum computing: Shor's algorithm can factor n efficiently, breaking RSA entirely.
- Side-channel attacks (timing, power analysis) on RSA implementations require constant-time modular exponentiation and CRT blinding.

## Alternatives

| Name | Comparison |
|------|-----------|
| Elliptic Curve Cryptography (ECC) | Provides equivalent security with much smaller keys (256-bit ECC ~ 3072-bit RSA). Faster key generation and signing. Preferred for new systems. |
| ML-KEM (Kyber) | A post-quantum key encapsulation mechanism that resists quantum attacks. Being standardized as a long-term replacement for RSA key exchange. |
| ElGamal Encryption | Another asymmetric encryption scheme based on the discrete logarithm problem. Produces ciphertexts twice the plaintext length. Used in some PGP implementations. |

## References

- [RFC 8017: PKCS #1 — RSA Cryptography Specifications Version 2.2](https://datatracker.ietf.org/doc/html/rfc8017)
- [NIST SP 800-56B: Recommendation for Pair-Wise Key-Establishment Using Integer Factorization Cryptography](https://csrc.nist.gov/publications/detail/sp/800-56b/rev-2/final)
- [Rivest, Shamir, Adleman — A Method for Obtaining Digital Signatures and Public-Key Cryptosystems (1978)](https://people.csail.mit.edu/rivest/Rsapaper.pdf)
