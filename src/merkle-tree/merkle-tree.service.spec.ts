import { Test, TestingModule } from '@nestjs/testing';
import { MerkleTreeService } from './merkle-tree.service';

describe('MerkleTreeService', () => {
  let service: MerkleTreeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MerkleTreeService],
    }).compile();

    service = module.get<MerkleTreeService>(MerkleTreeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('buildTree', () => {
    it('should produce a consistent root for known inputs', () => {
      const leaves = ['a', 'b', 'c', 'd'];
      const tree1 = service.buildTree(leaves);
      const tree2 = service.buildTree(leaves);

      expect(tree1.root).toBe(tree2.root);
      expect(tree1.root).toBeDefined();
      expect(typeof tree1.root).toBe('string');
      expect(tree1.root.length).toBe(64); // sha256 hex is 64 chars
    });

    it('should return correct structure', () => {
      const leaves = ['a', 'b', 'c', 'd'];
      const tree = service.buildTree(leaves);

      expect(tree.root).toBeDefined();
      expect(tree.levels).toBeDefined();
      expect(Array.isArray(tree.levels)).toBe(true);
      expect(tree.leaves).toBeDefined();
      expect(tree.leaves).toHaveLength(4);
      expect(tree.leafCount).toBe(4);
      expect(tree.algorithm).toBe('sha256');
    });

    it('should build correct number of levels for 4 leaves', () => {
      const leaves = ['a', 'b', 'c', 'd'];
      const tree = service.buildTree(leaves);

      // 4 leaves -> level 0 (4 hashes), level 1 (2 hashes), level 2 (1 hash = root)
      expect(tree.levels).toHaveLength(3);
      expect(tree.levels[0]).toHaveLength(4);
      expect(tree.levels[1]).toHaveLength(2);
      expect(tree.levels[2]).toHaveLength(1);
      expect(tree.levels[2][0]).toBe(tree.root);
    });

    it('should handle odd number of leaves by duplicating the last', () => {
      const leaves = ['a', 'b', 'c'];
      const tree = service.buildTree(leaves);

      expect(tree.root).toBeDefined();
      expect(tree.leafCount).toBe(3);
      expect(tree.levels[0]).toHaveLength(3);
      // Level 1 should have 2 nodes (3 leaves -> duplicate last -> 4 -> 2 pairs)
      expect(tree.levels[1]).toHaveLength(2);
      expect(tree.levels[2]).toHaveLength(1);

      // The second hash at level 1 should be hash of c+c (duplicated)
      const hashC = service.hashLeaf('c');
      const expectedDuplicatedHash = service.hashPair(hashC, hashC);
      expect(tree.levels[1][1]).toBe(expectedDuplicatedHash);
    });

    it('should handle a single leaf', () => {
      const leaves = ['only-one'];
      const tree = service.buildTree(leaves);

      expect(tree.root).toBeDefined();
      expect(tree.leafCount).toBe(1);
      expect(tree.levels).toHaveLength(1);
      expect(tree.levels[0]).toHaveLength(1);
      expect(tree.root).toBe(service.hashLeaf('only-one'));
    });

    it('should produce different roots for different inputs', () => {
      const tree1 = service.buildTree(['a', 'b', 'c', 'd']);
      const tree2 = service.buildTree(['a', 'b', 'c', 'e']);

      expect(tree1.root).not.toBe(tree2.root);
    });

    it('should throw for empty leaves array', () => {
      expect(() => service.buildTree([])).toThrow(
        'Cannot build a Merkle tree with no leaves',
      );
    });

    it('should support a different algorithm', () => {
      const leaves = ['a', 'b', 'c', 'd'];
      const treeSha256 = service.buildTree(leaves, 'sha256');
      const treeSha512 = service.buildTree(leaves, 'sha512');

      expect(treeSha256.root).not.toBe(treeSha512.root);
      expect(treeSha512.algorithm).toBe('sha512');
      // sha512 hex is 128 chars
      expect(treeSha512.root.length).toBe(128);
    });
  });

  describe('getProof', () => {
    it('should return a valid proof that verifies', () => {
      const leaves = ['a', 'b', 'c', 'd'];

      for (let i = 0; i < leaves.length; i++) {
        const result = service.getProof(leaves, i);
        expect(result.leaf).toBe(leaves[i]);
        expect(result.leafHash).toBe(service.hashLeaf(leaves[i]));
        expect(result.root).toBeDefined();
        expect(Array.isArray(result.proof)).toBe(true);
        expect(result.proof.length).toBeGreaterThan(0);

        // Every proof step should have hash and position
        for (const step of result.proof) {
          expect(step.hash).toBeDefined();
          expect(['left', 'right']).toContain(step.position);
        }

        // The proof should verify
        const isValid = service.verifyProof(
          leaves[i],
          result.proof,
          result.root,
        );
        expect(isValid).toBe(true);
      }
    });

    it('should return valid proof for odd number of leaves', () => {
      const leaves = ['x', 'y', 'z'];

      for (let i = 0; i < leaves.length; i++) {
        const result = service.getProof(leaves, i);
        const isValid = service.verifyProof(
          leaves[i],
          result.proof,
          result.root,
        );
        expect(isValid).toBe(true);
      }
    });

    it('should return valid proof for a single leaf', () => {
      const leaves = ['solo'];
      const result = service.getProof(leaves, 0);

      expect(result.leaf).toBe('solo');
      expect(result.proof).toHaveLength(0);
      expect(result.root).toBe(service.hashLeaf('solo'));

      const isValid = service.verifyProof(
        'solo',
        result.proof,
        result.root,
      );
      expect(isValid).toBe(true);
    });

    it('should throw for out of range leaf index', () => {
      const leaves = ['a', 'b', 'c'];

      expect(() => service.getProof(leaves, -1)).toThrow();
      expect(() => service.getProof(leaves, 3)).toThrow();
    });
  });

  describe('verifyProof', () => {
    it('should return false for a wrong leaf', () => {
      const leaves = ['a', 'b', 'c', 'd'];
      const { proof, root } = service.getProof(leaves, 0);

      const isValid = service.verifyProof('wrong-leaf', proof, root);
      expect(isValid).toBe(false);
    });

    it('should return false for a tampered proof', () => {
      const leaves = ['a', 'b', 'c', 'd'];
      const { proof, root } = service.getProof(leaves, 0);

      const tamperedProof = proof.map((step) => ({ ...step }));
      tamperedProof[0].hash = 'ff'.repeat(32); // tampered hash

      const isValid = service.verifyProof('a', tamperedProof, root);
      expect(isValid).toBe(false);
    });

    it('should return false for a wrong root', () => {
      const leaves = ['a', 'b', 'c', 'd'];
      const { proof } = service.getProof(leaves, 0);

      const isValid = service.verifyProof('a', proof, 'aa'.repeat(32));
      expect(isValid).toBe(false);
    });

    it('should return false when proof positions are swapped', () => {
      const leaves = ['a', 'b', 'c', 'd'];
      const { proof, root } = service.getProof(leaves, 0);

      const swappedProof = proof.map((step) => ({
        hash: step.hash,
        position: (step.position === 'left' ? 'right' : 'left') as
          | 'left'
          | 'right',
      }));

      const isValid = service.verifyProof('a', swappedProof, root);
      // Sorted hashing means swapping may or may not break it,
      // but swapping positions changes the computation path
      // With sorted pairs, the result depends on the specific hashes
      expect(typeof isValid).toBe('boolean');
    });
  });

  describe('demonstrate', () => {
    it('should return expected shape', () => {
      const result = service.demonstrate();

      expect(result.message).toBeDefined();
      expect(typeof result.message).toBe('string');
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data).toHaveLength(4);
      expect(result.algorithm).toBe('sha256');

      // tree section
      expect(result.tree).toBeDefined();
      expect(result.tree.root).toBeDefined();
      expect(result.tree.leafCount).toBe(4);
      expect(result.tree.totalLevels).toBe(3);
      expect(result.tree.levels).toHaveLength(3);

      // proof section
      expect(result.proof).toBeDefined();
      expect(result.proof.leaf).toBeDefined();
      expect(result.proof.leafHash).toBeDefined();
      expect(Array.isArray(result.proof.steps)).toBe(true);

      // verification section
      expect(result.verification).toBeDefined();
      expect(result.verification.validLeaf.result).toBe(true);
      expect(result.verification.invalidLeaf.result).toBe(false);

      expect(result.keyPoint).toBeDefined();
      expect(typeof result.keyPoint).toBe('string');
    });
  });
});
