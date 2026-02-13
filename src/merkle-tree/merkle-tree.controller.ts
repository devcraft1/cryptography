import { Body, Controller, Get, Post } from '@nestjs/common';
import { MerkleTreeService } from './merkle-tree.service';
import { BuildTreeDTO, VerifyProofDTO } from './dto';

@Controller('merkle-tree')
export class MerkleTreeController {
  constructor(private merkleTree: MerkleTreeService) {}

  @Post('build')
  buildTree(@Body() dto: BuildTreeDTO) {
    return this.merkleTree.buildTree(dto.leaves, dto.algorithm);
  }

  @Post('proof')
  getProof(
    @Body() body: { leaves: string[]; leafIndex: number; algorithm?: string },
  ) {
    return this.merkleTree.getProof(
      body.leaves,
      body.leafIndex,
      body.algorithm,
    );
  }

  @Post('verify')
  verifyProof(@Body() dto: VerifyProofDTO) {
    return this.merkleTree.verifyProof(
      dto.leaf,
      dto.proof,
      dto.root,
      dto.algorithm,
    );
  }

  @Get('demo')
  demonstrate() {
    return this.merkleTree.demonstrate();
  }
}
