import { Module } from '@nestjs/common';
import { CommitmentService } from './commitment.service';
import { CommitmentController } from './commitment.controller';

@Module({
  providers: [CommitmentService],
  controllers: [CommitmentController],
})
export class CommitmentModule {}
