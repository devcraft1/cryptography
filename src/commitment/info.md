# Commitment Schemes

**Slug:** `commitment-schemes`
**Category:** Cryptographic Protocols

> Commitment schemes allow a party to commit to a chosen value while keeping it hidden, with the ability to reveal it later in a verifiable way.

## Description

A commitment scheme is a two-phase cryptographic protocol that allows one party (the committer) to commit to a value while keeping it secret from others (the hiding property), and later reveal the committed value with proof that it has not been changed (the binding property). It functions like a sealed envelope: once sealed, the contents cannot be altered, and the recipient cannot peek inside until the envelope is opened.

Commitment schemes are fundamental building blocks in cryptographic protocols, including zero-knowledge proofs, secure multi-party computation, coin-flipping protocols, and auction systems. They ensure fairness by preventing parties from changing their choices after learning others' inputs.

The two essential security properties are: hiding (the commitment reveals nothing about the committed value) and binding (the committer cannot change the value after committing). Depending on the construction, one of these properties may be information-theoretic (unconditional) while the other is computational. Hash-based commitments are the most practical: the committer hashes the value concatenated with a random nonce, and later reveals both to verify.

## How It Works

1. The committer selects a secret value and generates a random nonce (blinding factor).
2. The committer computes a commitment, typically by hashing the concatenation of the value and nonce: C = H(value || nonce).
3. The commitment C is sent to the verifier. At this point, C reveals nothing about the value (hiding) and the committer cannot find a different value that produces the same commitment (binding).
4. When ready to reveal, the committer sends the original value and nonce to the verifier.
5. The verifier recomputes H(value || nonce) and checks that it matches C. If it matches, the commitment is verified as authentic.

## Real-World Use Cases

- Sealed-bid auctions where bidders commit to their bids before any are revealed, ensuring no bidder can adjust based on others' bids.
- Coin-flipping over a network, where two parties commit to random choices before revealing them to produce an unbiased result.
- Zero-knowledge proof systems that use commitments to hide witness values during interactive proofs.
- Secure multi-party computation protocols that use commitments to ensure parties cannot change their inputs mid-protocol.
- Blockchain timestamping where data hashes are committed on-chain to prove existence at a certain time.

## Security Considerations

- The nonce must be cryptographically random and sufficiently long (at least 128 bits) to prevent brute-force attacks on the hiding property.
- Hash-based commitments are computationally hiding and binding, meaning their security depends on the hash function's collision and preimage resistance.
- Pedersen commitments provide information-theoretic hiding (secure even against unbounded adversaries) but only computational binding.
- The commitment value and nonce must remain secret until the reveal phase; premature leakage compromises the scheme.
- The hash function used must be collision-resistant; a broken hash function allows the committer to equivocate (reveal different values).

## Alternatives

| Name | Comparison |
|------|-----------|
| Pedersen Commitments | Provide information-theoretic hiding and are additively homomorphic, allowing computations on committed values. Used extensively in blockchain privacy protocols. |
| Timed Commitments | Commitments that automatically reveal after a specified time period using time-lock puzzles, useful when the committer might not cooperate in the reveal phase. |
| Vector Commitments | Allow committing to a vector of values with the ability to selectively reveal individual elements, useful for authenticated data structures. |

## References

- [Gilles Brassard, David Chaum, Claude Crepeau — Minimum Disclosure Proofs of Knowledge (1988)](https://link.springer.com/article/10.1007/BF02351717)
- [Torben Pedersen — Non-Interactive and Information-Theoretic Secure Verifiable Secret Sharing (1991)](https://link.springer.com/chapter/10.1007/3-540-46766-1_9)
- [Commitment Scheme — Wikipedia](https://en.wikipedia.org/wiki/Commitment_scheme)
