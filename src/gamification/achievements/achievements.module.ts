import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import {
  Achievement,
  UserAchievement,
  UserProfile,
  QuestProgress,
  Streak,
} from '../entities';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Achievement,
      UserAchievement,
      UserProfile,
      QuestProgress,
      Streak,
    ]),
  ],
  providers: [AchievementsService],
  controllers: [AchievementsController],
  exports: [AchievementsService],
})
export class AchievementsModule {}
