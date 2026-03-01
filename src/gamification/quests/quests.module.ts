import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { QuestsService } from './quests.service';
import { QuestsController } from './quests.controller';
import { Chapter, Quest, Challenge, QuestProgress, UserProfile } from '../entities';
import { ChallengeEngineModule } from '../challenge-engine/challenge-engine.module';
import { ProgressModule } from '../progress/progress.module';
import { StreaksModule } from '../streaks/streaks.module';
import { AchievementsModule } from '../achievements/achievements.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Chapter, Quest, Challenge, QuestProgress, UserProfile]),
    ChallengeEngineModule,
    ProgressModule,
    StreaksModule,
    AchievementsModule,
  ],
  providers: [QuestsService],
  controllers: [QuestsController],
})
export class QuestsModule {}
