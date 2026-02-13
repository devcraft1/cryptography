# Secret Sharing (Shamir's)

**Slug:** `secret-sharing`
**Category:** Cryptographic Protocols

> Shamir's Secret Sharing splits a secret into multiple shares such that a minimum threshold of shares is required to reconstruct the secret, while fewer shares reveal nothing.

## Description

Shamir's Secret Sharing (SSS), introduced by Adi Shamir in 1979, is a (t, n) threshold scheme that divides a secret into n shares such that any t shares can reconstruct the secret, but any t-1 or fewer shares reveal absolutely no information about the secret. This information-theoretic security guarantee means the scheme is secure even against computationally unbounded adversaries.

The scheme is based on polynomial interpolation over a finite field. The secret is encoded as the constant term of a random polynomial of degree t-1. The n shares are evaluations of this polynomial at n distinct non-zero points. By Lagrange interpolation, any t points uniquely determine a polynomial of degree t-1, allowing reconstruction of the secret (the polynomial's constant term). With fewer than t points, the polynomial — and therefore the secret — remains completely undetermined.

Secret sharing is fundamental to distributed key management, threshold cryptography, secure multi-party computation, and cryptocurrency wallet security. It eliminates single points of failure for critical secrets by distributing trust across multiple parties or locations.

## How It Works

1. A random polynomial f(x) of degree t-1 is constructed over a finite field, where f(0) = secret (the secret is the constant term).
2. The remaining t-1 coefficients are generated randomly from the finite field.
3. Each share is computed as a point (i, f(i)) for i = 1, 2, ..., n, where each participant receives one point.
4. To reconstruct the secret, any t participants combine their shares and use Lagrange interpolation to recover f(x), then evaluate f(0) to obtain the secret.
5. With fewer than t shares, every possible secret value is equally likely (information-theoretic security), so no information about the secret is leaked.

## Real-World Use Cases

- Cryptocurrency wallet backup: splitting a master seed or private key into shares stored in different physical locations (e.g., using SLIP-39).
- Enterprise key management: distributing key material across multiple HSMs or administrators so no single person can access the secret.
- Threshold signatures: combining secret sharing with signature schemes so t-of-n parties must cooperate to produce a valid signature.
- Secure key escrow: splitting encryption keys for regulatory compliance such that a quorum of authorized parties is needed for recovery.
- Distributed certificate authority operations: requiring multiple administrators to cooperate for CA key usage.

## Security Considerations

- Share distribution must occur over secure channels; interception of t or more shares during distribution compromises the secret.
- The secret and shares must be generated using a CSPRNG over a sufficiently large finite field (at least 256 bits) to prevent brute-force attacks on the field.
- Basic Shamir's SSS does not provide verifiable shares — a malicious participant could submit a fake share. Verifiable Secret Sharing (VSS) schemes like Feldman's or Pedersen's address this.
- Share refresh (proactive secret sharing) can be used to update shares periodically without changing the secret, limiting the window for share compromise.
- The dealer (party creating the shares) knows the secret and all shares; for higher security, distributed key generation (DKG) eliminates the need for a trusted dealer.

## Alternatives

| Name | Comparison |
|------|-----------|
| Blakley's Secret Sharing | Uses geometric (hyperplane intersection) approach instead of polynomial interpolation. Produces larger shares than Shamir's scheme. Less commonly used in practice. |
| Multi-Signature (Multisig) | Multiple parties each sign independently with their own keys, requiring t-of-n signatures for authorization. Simpler but reveals the number of signers and their public keys on-chain. |
| Distributed Key Generation (DKG) | Generates a shared secret key without any single party ever knowing the complete secret. Eliminates the trusted dealer assumption of basic Shamir's SSS. More complex protocol but stronger trust model. |

## References

- [Adi Shamir — How to Share a Secret (1979)](https://dl.acm.org/doi/10.1145/359168.359176)
- [SLIP-39: Shamir's Secret-Sharing for Mnemonic Codes](https://github.com/satoshilabs/slips/blob/master/slip-0039.md)
- [Paul Feldman — A Practical Scheme for Non-Interactive Verifiable Secret Sharing (1987)](https://ieeexplore.ieee.org/document/4568297)
