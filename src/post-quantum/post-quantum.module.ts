import { Module } from '@nestjs/common';
import { PostQuantumService } from './post-quantum.service';
import { PostQuantumController } from './post-quantum.controller';

@Module({
  providers: [PostQuantumService],
  controllers: [PostQuantumController],
  exports: [PostQuantumService],
})
export class PostQuantumModule {}
