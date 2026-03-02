import { Module } from '@nestjs/common';
import { GameAuthModule } from './auth/auth.module';
import { GameUsersModule } from './users/users.module';
import { QuestsModule } from './quests/quests.module';
import { ProgressModule } from './progress/progress.module';
import { AchievementsModule } from './achievements/achievements.module';
import { StreaksModule } from './streaks/streaks.module';
import { ChallengeEngineModule } from './challenge-engine/challenge-engine.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    GameAuthModule,
    GameUsersModule,
    QuestsModule,
    ProgressModule,
    AchievementsModule,
    StreaksModule,
    ChallengeEngineModule,
    SeedModule,
  ],
})
export class GamificationModule {}
