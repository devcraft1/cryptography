import { Module } from '@nestjs/common';
import { MerkleTreeService } from './merkle-tree.service';
import { MerkleTreeController } from './merkle-tree.controller';

@Module({
  providers: [MerkleTreeService],
  controllers: [MerkleTreeController],
})
export class MerkleTreeModule {}
