# Blind Signatures

**Slug:** `blind-signatures`
**Category:** Digital Signatures

> Blind signatures allow a signer to sign a message without seeing its content, enabling privacy-preserving authentication and anonymous credential systems.

## Description

Blind signatures, introduced by David Chaum in 1983, are a form of digital signature where the content of the message is disguised (blinded) before being signed. The signer produces a valid signature on the message without learning anything about its content. Once signed, the requester can unblind the signature to obtain a standard digital signature that is verifiable by anyone.

This primitive is fundamental to building systems that require both authentication and privacy. The classic analogy is signing a document through carbon paper inside a sealed envelope — the signer's signature transfers to the document without the signer ever seeing what they signed.

Blind signatures are most commonly implemented using RSA, where the blinding operation exploits the multiplicative homomorphic property of RSA. Modern variants based on elliptic curves and pairing-based cryptography offer improved efficiency and additional properties such as partial blindness, where some parts of the message are visible to the signer.

## How It Works

1. The requester generates a random blinding factor and uses it to mathematically obscure the original message.
2. The blinded message is sent to the signer, who applies their private signing key without being able to determine the original content.
3. The signer returns the blind signature to the requester.
4. The requester removes the blinding factor (unblinds), producing a valid digital signature on the original message.
5. Anyone can verify the resulting signature using the signer's public key, confirming the signer authorized the message — but the signer cannot link the signature back to the blinding session.

## Real-World Use Cases

- Digital cash systems (e-cash) where a bank signs tokens without knowing which user will spend them, preserving transaction privacy.
- Anonymous voting systems where an authority certifies a voter's eligibility without learning their vote.
- Privacy Pass and similar token-based anti-abuse systems that provide anonymous authentication.
- Anonymous credential systems for age verification or access control without revealing identity.
- Unlinkable digital coupons and loyalty programs.

## Security Considerations

- The signer must trust the blinding protocol; without additional constraints, the signer could unknowingly sign arbitrary messages.
- RSA-based blind signatures require careful parameter selection to resist chosen-message attacks.
- The blinding factor must be truly random and kept secret by the requester until unblinding.
- Blind signatures alone do not prevent double-spending in digital cash — additional mechanisms are needed.
- Partial blindness can be used to embed mandatory metadata (like expiry dates) visible to the signer.

## Alternatives

| Name | Comparison |
|------|-----------|
| Group Signatures | Allow a member of a group to sign anonymously on behalf of the group, with a designated authority able to reveal the signer's identity if needed. Different trust model than blind signatures. |
| Ring Signatures | Enable a signer to produce a signature that could have come from any member of a set, without requiring a central authority. No unblinding step or signer cooperation needed. |
| Zero-Knowledge Proofs | Can be used to achieve similar privacy goals but through proof of knowledge rather than signature blinding. More flexible but typically more computationally expensive. |

## References

- [David Chaum — Blind Signatures for Untraceable Payments (1983)](https://link.springer.com/chapter/10.1007/978-1-4757-0602-4_18)
- [RFC 9474: RSA Blind Signatures](https://datatracker.ietf.org/doc/html/rfc9474)
- [Privacy Pass Protocol Specification](https://datatracker.ietf.org/doc/html/draft-ietf-privacypass-protocol)
