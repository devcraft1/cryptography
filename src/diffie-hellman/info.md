# Diffie-Hellman Key Exchange

**Slug:** `diffie-hellman-key-exchange`
**Category:** Key Exchange

> Diffie-Hellman key exchange enables two parties to establish a shared secret over an insecure channel without any prior shared secrets.

## Description

The Diffie-Hellman (DH) key exchange, published by Whitfield Diffie and Martin Hellman in 1976, was the first practical method for establishing a shared secret between two parties communicating over a public channel. It is one of the earliest implementations of public key cryptography and remains a cornerstone of modern secure communication.

The protocol's security relies on the computational difficulty of the discrete logarithm problem: given a large prime p, a generator g, and the value g^a mod p, it is computationally infeasible to determine a. Both parties independently generate private exponents, exchange computed public values, and arrive at the same shared secret through the commutativity of exponentiation.

Modern deployments predominantly use Elliptic Curve Diffie-Hellman (ECDH), which provides equivalent security with much smaller key sizes. Ephemeral variants (DHE, ECDHE) generate fresh key pairs for each session, providing perfect forward secrecy — meaning compromise of long-term keys does not reveal past session keys. TLS 1.3 mandates ephemeral key exchange, making ECDHE the standard for securing internet traffic.

## How It Works

1. Alice and Bob agree on public parameters: a large prime number p and a generator g (or an elliptic curve and base point for ECDH).
2. Alice generates a random private key a and computes her public value A = g^a mod p. Bob generates private key b and computes B = g^b mod p.
3. Alice sends A to Bob, and Bob sends B to Alice over the public channel.
4. Alice computes the shared secret as S = B^a mod p. Bob computes S = A^b mod p. Both arrive at the same value: g^(ab) mod p.
5. The shared secret S is then used (typically after key derivation with HKDF) as a symmetric encryption key for securing subsequent communication.

## Real-World Use Cases

- TLS/HTTPS key exchange using ECDHE cipher suites to establish session keys with forward secrecy.
- SSH protocol uses DH or ECDH to negotiate session encryption keys during connection setup.
- Signal Protocol uses X25519 (ECDH on Curve25519) for its Double Ratchet key agreement.
- IPsec/IKE VPN connections use DH groups to establish shared keys for tunnel encryption.
- WireGuard VPN uses Curve25519 ECDH as its sole key exchange mechanism.

## Security Considerations

- Basic DH is vulnerable to man-in-the-middle attacks; it must be combined with authentication (certificates, signatures, or pre-shared keys).
- Small subgroup attacks can occur if parameters are not validated; safe primes or elliptic curves with cofactor 1 mitigate this.
- Classical DH groups must use sufficiently large primes (at least 2048 bits); 1024-bit groups are considered insecure.
- Ephemeral key pairs (DHE/ECDHE) should be used to achieve perfect forward secrecy; static DH does not provide this property.
- Diffie-Hellman is vulnerable to quantum computing attacks; post-quantum key exchange mechanisms (e.g., ML-KEM/Kyber) are being standardized as replacements.

## Alternatives

| Name | Comparison |
|------|-----------|
| ECDH (Elliptic Curve Diffie-Hellman) | The elliptic curve variant of DH that provides equivalent security with much smaller key sizes (256-bit ECC ~ 3072-bit DH). Preferred in modern protocols. |
| RSA Key Exchange | An older key exchange method where the client encrypts a pre-master secret with the server's RSA public key. Deprecated in TLS 1.3 because it lacks forward secrecy. |
| ML-KEM (Kyber) | A lattice-based post-quantum key encapsulation mechanism designed to resist quantum computer attacks. Being standardized as a replacement for DH/ECDH. |

## References

- [Whitfield Diffie and Martin Hellman — New Directions in Cryptography (1976)](https://ieeexplore.ieee.org/document/1055638)
- [RFC 7748: Elliptic Curves for Security (X25519, X448)](https://datatracker.ietf.org/doc/html/rfc7748)
- [RFC 7919: Negotiated Finite Field Diffie-Hellman Ephemeral Parameters for TLS](https://datatracker.ietf.org/doc/html/rfc7919)
