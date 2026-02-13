# Zero-Knowledge Proofs

**Slug:** `zero-knowledge-proofs`
**Category:** Cryptographic Protocols

> Zero-knowledge proofs allow one party to prove knowledge of a secret or the truth of a statement without revealing any information beyond the validity of the claim itself.

## Description

A zero-knowledge proof (ZKP) is a cryptographic protocol in which a prover can convince a verifier that a statement is true without revealing any information beyond the truth of the statement itself. The concept was introduced by Goldwasser, Micali, and Rackoff in 1985 and has since become one of the most important tools in cryptography.

A zero-knowledge proof must satisfy three properties: completeness (an honest prover can always convince an honest verifier), soundness (a cheating prover cannot convince the verifier of a false statement, except with negligible probability), and zero-knowledge (the verifier learns nothing beyond the fact that the statement is true).

ZKPs can be interactive (requiring multiple rounds of communication) or non-interactive (a single message from prover to verifier, typically using the Fiat-Shamir heuristic). Modern ZKP systems include zk-SNARKs (Succinct Non-interactive Arguments of Knowledge), zk-STARKs (Scalable Transparent Arguments of Knowledge), Bulletproofs, and Groth16. These systems enable proving arbitrary computational statements (expressed as circuits or programs) in zero knowledge, opening up applications in blockchain privacy, authentication, and verifiable computation.

## How It Works

1. The prover formulates the statement to be proven as a mathematical relation (often as an arithmetic circuit or R1CS constraint system).
2. **For interactive ZKPs:** the prover and verifier engage in a challenge-response protocol. The prover commits to random values, the verifier sends random challenges, and the prover responds. After multiple rounds, the verifier is convinced.
3. **For non-interactive ZKPs (zk-SNARKs):** the prover computes a single proof using the witness (secret input) and public parameters. The proof is compact (typically a few hundred bytes) and verifiable in milliseconds.
4. The verifier checks the proof using the public inputs and verification key. Verification is much faster than proof generation.
5. The zero-knowledge property ensures that the proof reveals nothing about the witness — only that the prover knows a valid witness satisfying the relation.

## Real-World Use Cases

- Blockchain privacy: Zcash uses zk-SNARKs to enable private transactions where the sender, recipient, and amount are hidden while still verifying transaction validity.
- Layer-2 scaling (zk-Rollups): Ethereum rollups like zkSync and StarkNet use zero-knowledge proofs to compress thousands of transactions into a single proof verified on-chain.
- Identity verification: proving you are over 18 without revealing your date of birth, or proving you are a member of a group without revealing which member.
- Verifiable computation: proving that a computation was performed correctly without the verifier re-executing it (useful for cloud computing integrity).
- Password authentication: proving knowledge of a password without transmitting it (ZKP-based authentication protocols like SRP).

## Security Considerations

- zk-SNARKs (Groth16) require a trusted setup ceremony; if the setup is compromised, an attacker can create fake proofs. Transparent schemes (zk-STARKs, PLONK with universal setup) avoid this issue.
- The soundness guarantee is computational, not information-theoretic: a computationally unbounded adversary could theoretically create false proofs.
- Proof generation is computationally intensive, especially for complex statements. Optimized hardware (GPUs, FPGAs) and proof systems (Halo2, Nova) aim to reduce this cost.
- Side-channel attacks during proof generation could leak information about the secret witness; constant-time implementation is important.
- The statement being proven must be carefully formulated; a correct proof of a poorly specified statement may not provide the intended security guarantees.

## Alternatives

| Name | Comparison |
|------|-----------|
| zk-STARKs | Transparent (no trusted setup) and post-quantum secure, but produce larger proofs than zk-SNARKs. Based on hash functions rather than elliptic curves. Preferred when transparency and quantum resistance matter. |
| Bulletproofs | Produce compact proofs without a trusted setup, particularly efficient for range proofs. Verification is slower than zk-SNARKs (linear vs. constant time). Used in Monero for confidential transactions. |
| MPC (Secure Multi-Party Computation) | Multiple parties jointly compute a function without revealing their inputs. Can achieve similar privacy goals but requires interaction between parties and is typically more communication-intensive. |

## References

- [Goldwasser, Micali, Rackoff — The Knowledge Complexity of Interactive Proof Systems (1985)](https://people.csail.mit.edu/silvio/Selected%20Scientific%20Papers/Proof%20Systems/The_Knowledge_Complexity_Of_Interactive_Proof_Systems.pdf)
- [Groth16: On the Size of Pairing-Based Non-Interactive Arguments](https://eprint.iacr.org/2016/260)
- [Eli Ben-Sasson et al. — Scalable, Transparent, and Post-Quantum Secure Computational Integrity (STARKs)](https://eprint.iacr.org/2018/046)
