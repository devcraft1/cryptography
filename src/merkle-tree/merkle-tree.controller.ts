import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MerkleTreeService } from './merkle-tree.service';
import { BuildTreeDTO, VerifyProofDTO, GetProofDTO } from './dto';

@ApiTags('Merkle Tree')
@Controller('merkle-tree')
export class MerkleTreeController {
  constructor(private merkleTree: MerkleTreeService) {}

  @Post('build')
  buildTree(@Body() dto: BuildTreeDTO) {
    return this.merkleTree.buildTree(dto.leaves, dto.algorithm);
  }

  @Post('proof')
  getProof(
    @Body() dto: GetProofDTO,
  ) {
    return this.merkleTree.getProof(
      dto.leaves,
      dto.leafIndex,
      dto.algorithm,
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
