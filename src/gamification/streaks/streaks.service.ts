import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Streak } from '../entities';

@Injectable()
export class StreaksService {
  constructor(
    @InjectModel(Streak) private streakModel: typeof Streak,
  ) {}

  async recordActivity(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    let streak = await this.streakModel.findOne({ where: { userId } });

    if (!streak) {
      streak = await this.streakModel.create({
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: today,
      });
      return streak;
    }

    if (streak.lastActivityDate === today) return streak;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (streak.lastActivityDate === yesterdayStr) {
      const newStreak = streak.currentStreak + 1;
      await streak.update({
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, streak.longestStreak),
        lastActivityDate: today,
      });
    } else {
      await streak.update({
        currentStreak: 1,
        lastActivityDate: today,
      });
    }

    return streak;
  }
}
