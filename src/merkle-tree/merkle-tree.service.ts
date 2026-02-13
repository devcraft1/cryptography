import { BadRequestException, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class MerkleTreeService {
  hashLeaf(data: string, algorithm = 'sha256'): string {
    return createHash(algorithm).update(data).digest('hex');
  }

  hashPair(left: string, right: string, algorithm = 'sha256'): string {
    const sorted = [left, right].sort();
    return createHash(algorithm)
      .update(sorted[0] + sorted[1])
      .digest('hex');
  }

  buildTree(leaves: string[], algorithm = 'sha256') {
    if (leaves.length === 0) {
      throw new BadRequestException('Cannot build a Merkle tree with no leaves');
    }

    const leafHashes = leaves.map((leaf) => this.hashLeaf(leaf, algorithm));
    const levels: string[][] = [leafHashes];

    let currentLevel = leafHashes;

    while (currentLevel.length > 1) {
      const nextLevel: string[] = [];

      // If odd number of nodes, duplicate the last one
      if (currentLevel.length % 2 !== 0) {
        currentLevel = [...currentLevel, currentLevel[currentLevel.length - 1]];
      }

      for (let i = 0; i < currentLevel.length; i += 2) {
        nextLevel.push(
          this.hashPair(currentLevel[i], currentLevel[i + 1], algorithm),
        );
      }

      levels.push(nextLevel);
      currentLevel = nextLevel;
    }

    return {
      root: currentLevel[0],
      levels,
      leaves: leafHashes,
      leafCount: leaves.length,
      algorithm,
    };
  }

  getProof(leaves: string[], leafIndex: number, algorithm = 'sha256') {
    if (leafIndex < 0 || leafIndex >= leaves.length) {
      throw new BadRequestException(
        `Leaf index ${leafIndex} out of range [0, ${leaves.length - 1}]`,
      );
    }

    const tree = this.buildTree(leaves, algorithm);
    const proof: { hash: string; position: 'left' | 'right' }[] = [];

    let index = leafIndex;

    for (let level = 0; level < tree.levels.length - 1; level++) {
      let currentLevel = tree.levels[level];

      // If odd number of nodes, duplicate the last one (matches buildTree logic)
      if (currentLevel.length % 2 !== 0) {
        currentLevel = [...currentLevel, currentLevel[currentLevel.length - 1]];
      }

      const isRightNode = index % 2 === 1;
      const siblingIndex = isRightNode ? index - 1 : index + 1;

      proof.push({
        hash: currentLevel[siblingIndex],
        position: isRightNode ? 'left' : 'right',
      });

      index = Math.floor(index / 2);
    }

    return {
      leaf: leaves[leafIndex],
      leafHash: tree.leaves[leafIndex],
      proof,
      root: tree.root,
    };
  }

  verifyProof(
    leaf: string,
    proof: { hash: string; position: 'left' | 'right' }[],
    root: string,
    algorithm = 'sha256',
  ): boolean {
    let currentHash = this.hashLeaf(leaf, algorithm);

    for (const step of proof) {
      if (step.position === 'left') {
        currentHash = this.hashPair(step.hash, currentHash, algorithm);
      } else {
        currentHash = this.hashPair(currentHash, step.hash, algorithm);
      }
    }

    return currentHash === root;
  }

  demonstrate() {
    const data = [
      'Alice sends Bob 10 BTC',
      'Bob sends Carol 5 BTC',
      'Carol sends Dave 3 BTC',
      'Dave sends Alice 1 BTC',
    ];
    const algorithm = 'sha256';

    const tree = this.buildTree(data, algorithm);

    const proofForLeaf1 = this.getProof(data, 1, algorithm);
    const validVerification = this.verifyProof(
      data[1],
      proofForLeaf1.proof,
      tree.root,
      algorithm,
    );

    const invalidVerification = this.verifyProof(
      'Tampered transaction data',
      proofForLeaf1.proof,
      tree.root,
      algorithm,
    );

    return {
      message:
        'Merkle Tree: A hash tree that enables efficient and secure verification of data integrity',
      data,
      algorithm,
      tree: {
        root: tree.root,
        leafCount: tree.leafCount,
        totalLevels: tree.levels.length,
        levels: tree.levels,
      },
      proof: {
        description: `Inclusion proof for leaf at index 1: "${data[1]}"`,
        leaf: proofForLeaf1.leaf,
        leafHash: proofForLeaf1.leafHash,
        steps: proofForLeaf1.proof,
      },
      verification: {
        validLeaf: {
          leaf: data[1],
          result: validVerification,
          description: 'Proof verification with the correct leaf succeeds',
        },
        invalidLeaf: {
          leaf: 'Tampered transaction data',
          result: invalidVerification,
          description: 'Proof verification with a tampered leaf fails',
        },
      },
      keyPoint:
        'Merkle proofs allow verifying a single item belongs to a dataset using only O(log n) hashes, without needing the entire dataset',
    };
  }
}
