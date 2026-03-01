import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserProfile, QuestProgress, Quest, Chapter } from '../entities';

const RANKS = [
  'Recruit',
  'Field Agent',
  'Operative',
  'Senior Operative',
  'Specialist',
  'Cryptanalyst',
  'Director',
];

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(UserProfile) private profileModel: typeof UserProfile,
    @InjectModel(QuestProgress) private progressModel: typeof QuestProgress,
    @InjectModel(Quest) private questModel: typeof Quest,
  ) {}

  calculateLevel(totalXp: number): number {
    return Math.floor(Math.sqrt(totalXp / 100)) + 1;
  }

  calculateRank(level: number): string {
    if (level >= 25) return RANKS[6];
    if (level >= 20) return RANKS[5];
    if (level >= 15) return RANKS[4];
    if (level >= 10) return RANKS[3];
    if (level >= 7) return RANKS[2];
    if (level >= 4) return RANKS[1];
    return RANKS[0];
  }

  async addXp(userId: string, xp: number) {
    const profile = await this.profileModel.findOne({ where: { userId } });
    if (!profile) return;

    const newXp = profile.totalXp + xp;
    const newLevel = this.calculateLevel(newXp);
    const newRank = this.calculateRank(newLevel);

    await profile.update({
      totalXp: newXp,
      level: newLevel,
      rank: newRank,
    });

    return { totalXp: newXp, level: newLevel, rank: newRank, xpGained: xp };
  }

  async getOverview(userId: string) {
    const profile = await this.profileModel.findOne({ where: { userId } });
    const progress = await this.progressModel.findAll({
      where: { userId },
      include: [{ model: this.questModel, include: [Chapter] }],
    });

    const completed = progress.filter((p) => p.status === 'completed').length;
    const inProgress = progress.filter(
      (p) => p.status === 'in_progress',
    ).length;
    const totalQuests = await this.questModel.count();

    return {
      profile: {
        totalXp: profile?.totalXp || 0,
        level: profile?.level || 1,
        rank: profile?.rank || 'Recruit',
        currentChapter: profile?.currentChapter || 1,
      },
      quests: {
        completed,
        inProgress,
        total: totalQuests,
        percentComplete:
          totalQuests > 0 ? Math.round((completed / totalQuests) * 100) : 0,
      },
      progress: progress.map((p) => ({
        questId: p.questId,
        status: p.status,
        score: p.score,
        attempts: p.attempts,
      })),
    };
  }

  async initializeQuestProgress(userId: string) {
    const quests = await this.questModel.findAll({
      order: [['orderIndex', 'ASC']],
      include: [Chapter],
    });

    for (const quest of quests) {
      const existing = await this.progressModel.findOne({
        where: { userId, questId: quest.id },
      });
      if (existing) continue;

      const status =
        quest.chapter?.orderIndex === 1 && quest.orderIndex === 1
          ? 'available'
          : 'locked';

      await this.progressModel.create({
        userId,
        questId: quest.id,
        status,
      });
    }
  }

  async unlockNextQuest(userId: string, completedQuestId: string) {
    const completedQuest = await this.questModel.findByPk(completedQuestId, {
      include: [Chapter],
    });
    if (!completedQuest) return;

    const nextQuest = await this.questModel.findOne({
      where: { chapterId: completedQuest.chapterId },
      order: [['orderIndex', 'ASC']],
    });

    const allInChapter = await this.questModel.findAll({
      where: { chapterId: completedQuest.chapterId },
      order: [['orderIndex', 'ASC']],
    });

    const nextInChapter = allInChapter.find(
      (q) => q.orderIndex > completedQuest.orderIndex,
    );

    if (nextInChapter) {
      await this.progressModel.update(
        { status: 'available' },
        { where: { userId, questId: nextInChapter.id, status: 'locked' } },
      );
    } else {
      const nextChapter = await this.questModel.findOne({
        include: [
          {
            model: Chapter,
            where: {},
          },
        ],
        order: [[Chapter, 'orderIndex', 'ASC'], ['orderIndex', 'ASC']],
      });

      const allChapterQuests = await this.questModel.findAll({
        include: [Chapter],
        order: [[Chapter, 'orderIndex', 'ASC'], ['orderIndex', 'ASC']],
      });

      const currentIdx = allChapterQuests.findIndex(
        (q) => q.id === completedQuestId,
      );
      if (currentIdx >= 0 && currentIdx < allChapterQuests.length - 1) {
        const next = allChapterQuests[currentIdx + 1];
        await this.progressModel.update(
          { status: 'available' },
          { where: { userId, questId: next.id, status: 'locked' } },
        );

        const profile = await this.profileModel.findOne({
          where: { userId },
        });
        if (profile && next.chapter) {
          await profile.update({ currentChapter: next.chapter.orderIndex });
        }
      }
    }
  }
}
