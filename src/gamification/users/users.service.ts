import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserProfile, QuestProgress, UserAchievement, Streak } from '../entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(UserProfile) private profileModel: typeof UserProfile,
    @InjectModel(QuestProgress) private progressModel: typeof QuestProgress,
    @InjectModel(UserAchievement) private achievementModel: typeof UserAchievement,
    @InjectModel(Streak) private streakModel: typeof Streak,
  ) {}

  async getMe(userId: string) {
    const user = await this.userModel.findByPk(userId, {
      attributes: { exclude: ['passwordHash'] },
      include: [UserProfile, Streak],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getStats(userId: string) {
    const profile = await this.profileModel.findOne({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');

    const completedQuests = await this.progressModel.count({
      where: { userId, status: 'completed' },
    });
    const totalAchievements = await this.achievementModel.count({
      where: { userId },
    });
    const streak = await this.streakModel.findOne({ where: { userId } });

    return {
      totalXp: profile.totalXp,
      level: profile.level,
      rank: profile.rank,
      currentChapter: profile.currentChapter,
      completedQuests,
      totalAchievements,
      currentStreak: streak?.currentStreak || 0,
      longestStreak: streak?.longestStreak || 0,
    };
  }
}
