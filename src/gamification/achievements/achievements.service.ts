import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  Achievement,
  UserAchievement,
  UserProfile,
  QuestProgress,
  Streak,
} from '../entities';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectModel(Achievement) private achievementModel: typeof Achievement,
    @InjectModel(UserAchievement) private userAchievementModel: typeof UserAchievement,
    @InjectModel(UserProfile) private profileModel: typeof UserProfile,
    @InjectModel(QuestProgress) private progressModel: typeof QuestProgress,
    @InjectModel(Streak) private streakModel: typeof Streak,
  ) {}

  async getAll(userId: string) {
    const achievements = await this.achievementModel.findAll();
    const unlocked = await this.userAchievementModel.findAll({
      where: { userId },
    });
    const unlockedIds = new Set(unlocked.map((u) => u.achievementId));

    return achievements.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      description: a.description,
      category: a.category,
      xpBonus: a.xpBonus,
      unlocked: unlockedIds.has(a.id),
      unlockedAt: unlocked.find((u) => u.achievementId === a.id)?.unlockedAt,
    }));
  }

  async checkAndUnlock(userId: string): Promise<Achievement[]> {
    const achievements = await this.achievementModel.findAll();
    const unlocked = await this.userAchievementModel.findAll({
      where: { userId },
    });
    const unlockedSlugs = new Set(
      unlocked.map((u) => {
        const ach = achievements.find((a) => a.id === u.achievementId);
        return ach?.slug;
      }),
    );

    const profile = await this.profileModel.findOne({ where: { userId } });
    const completedCount = await this.progressModel.count({
      where: { userId, status: 'completed' },
    });
    const streak = await this.streakModel.findOne({ where: { userId } });

    const newlyUnlocked: Achievement[] = [];

    for (const achievement of achievements) {
      if (unlockedSlugs.has(achievement.slug)) continue;

      const condition = achievement.condition as Record<string, any>;
      let met = false;

      switch (condition.type) {
        case 'quests_completed':
          met = completedCount >= (condition.count || 0);
          break;
        case 'chapter_completed':
          met = (profile?.currentChapter || 1) > (condition.chapter || 0);
          break;
        case 'streak_days':
          met = (streak?.currentStreak || 0) >= (condition.days || 0);
          break;
        case 'xp_total':
          met = (profile?.totalXp || 0) >= (condition.xp || 0);
          break;
        case 'level_reached':
          met = (profile?.level || 1) >= (condition.level || 0);
          break;
      }

      if (met) {
        await this.userAchievementModel.create({
          userId,
          achievementId: achievement.id,
        });
        newlyUnlocked.push(achievement);
      }
    }

    return newlyUnlocked;
  }
}
