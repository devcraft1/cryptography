# Merkle Trees

**Slug:** `merkle-trees`
**Category:** Data Structures

> Merkle trees are hash-based binary tree structures that enable efficient and secure verification of data integrity across large datasets using compact cryptographic proofs.

## Description

A Merkle tree (or hash tree), invented by Ralph Merkle in 1979, is a tree data structure where every leaf node contains the hash of a data block, and every non-leaf node contains the hash of its children's hashes. The root of the tree — the Merkle root — is a single hash that cryptographically commits to the entire dataset.

The key property of a Merkle tree is that it enables efficient membership proofs: to prove that a specific data block is part of the dataset, only a logarithmic number of hashes (the "Merkle proof" or "authentication path") need to be provided, rather than the entire dataset. This makes Merkle trees fundamental to systems that need to verify data integrity at scale.

Merkle trees are essential to blockchain technology (every block in Bitcoin and Ethereum contains a Merkle root of its transactions), certificate transparency (CT logs use Merkle trees to provide append-only audit proofs), content-addressable storage (Git, IPFS), and peer-to-peer file sharing (BitTorrent). Variants like Merkle Patricia Tries (Ethereum), Sparse Merkle Trees, and Verkle Trees extend the basic concept for specific use cases.

## How It Works

1. Each data block (leaf) is hashed individually using a cryptographic hash function (e.g., SHA-256).
2. Adjacent leaf hashes are paired and concatenated, then hashed together to form parent nodes. If there is an odd number of nodes, the last one is either duplicated or promoted.
3. This pairing and hashing process continues up the tree until a single root hash (Merkle root) remains.
4. To prove a leaf is in the tree (Merkle proof), only the sibling hashes along the path from the leaf to the root are needed — O(log n) hashes for n leaves.
5. A verifier recomputes the root hash from the leaf and the proof hashes, comparing it to the known Merkle root to confirm membership.

## Real-World Use Cases

- Bitcoin and blockchain: each block header contains the Merkle root of all transactions, enabling SPV (Simplified Payment Verification) clients to verify transactions without downloading the full block.
- Certificate Transparency: CT logs use Merkle trees to provide cryptographic proofs that specific certificates have been logged, enabling detection of misissued certificates.
- Git version control: uses Merkle tree-like structures (content-addressable objects) to efficiently track file changes and detect data corruption.
- IPFS (InterPlanetary File System) uses Merkle DAGs for content-addressable, verifiable file storage and retrieval.
- Amazon Dynamo and Apache Cassandra use Merkle trees for anti-entropy repair — efficiently comparing and synchronizing data between replicas.

## Security Considerations

- Second preimage attacks on Merkle trees can be prevented by using domain separation: leaf hashes use a 0x00 prefix, and internal nodes use a 0x01 prefix.
- The hash function must be collision-resistant; a broken hash function allows creating different datasets with the same Merkle root.
- Merkle proofs verify membership but not non-membership; Sparse Merkle Trees or sorted Merkle Trees are needed for non-membership proofs.
- Tree construction must be deterministic (consistent ordering) to ensure the same dataset always produces the same root hash.
- Proof verification must check that the proof has the correct length (log2(n)) to prevent proofs that skip levels.

## Alternatives

| Name | Comparison |
|------|-----------|
| Verkle Trees | Use vector commitments instead of hashes, enabling much smaller proofs (constant size vs. logarithmic). Being adopted by Ethereum for state management. More complex cryptography but significantly more efficient for large-scale proofs. |
| Sparse Merkle Trees | A Merkle tree over a vast key space (e.g., 2^256) where most leaves are empty. Supports both membership and non-membership proofs. Used in some blockchain state representations. |
| Accumulator (RSA or Bilinear) | A cryptographic primitive that provides constant-size membership and non-membership proofs, regardless of set size. More compact than Merkle proofs but require trusted setup or more expensive operations. |

## References

- [Ralph Merkle — A Digital Signature Based on a Conventional Encryption Function (1987)](https://link.springer.com/chapter/10.1007/3-540-48184-2_32)
- [RFC 6962: Certificate Transparency](https://datatracker.ietf.org/doc/html/rfc6962)
- [Bitcoin Developer Guide — Merkle Trees](https://developer.bitcoin.org/devguide/block_chain.html)
