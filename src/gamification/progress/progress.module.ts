import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { UserProfile, QuestProgress, Quest, Chapter } from '../entities';

@Module({
  imports: [SequelizeModule.forFeature([UserProfile, QuestProgress, Quest, Chapter])],
  providers: [ProgressService],
  controllers: [ProgressController],
  exports: [ProgressService],
})
export class ProgressModule {}
