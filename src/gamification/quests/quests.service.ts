import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chapter, Quest, Challenge, QuestProgress, UserProfile } from '../entities';
import { ChallengeEngineService } from '../challenge-engine/challenge-engine.service';
import { ProgressService } from '../progress/progress.service';
import { StreaksService } from '../streaks/streaks.service';
import { AchievementsService } from '../achievements/achievements.service';

@Injectable()
export class QuestsService {
  constructor(
    @InjectModel(Chapter) private chapterModel: typeof Chapter,
    @InjectModel(Quest) private questModel: typeof Quest,
    @InjectModel(Challenge) private challengeModel: typeof Challenge,
    @InjectModel(QuestProgress) private progressModel: typeof QuestProgress,
    @InjectModel(UserProfile) private profileModel: typeof UserProfile,
    private challengeEngine: ChallengeEngineService,
    private progressService: ProgressService,
    private streaksService: StreaksService,
    private achievementsService: AchievementsService,
  ) {}

  async getChapters(userId: string) {
    const chapters = await this.chapterModel.findAll({
      include: [{ model: Quest }],
      order: [['orderIndex', 'ASC'], [Quest, 'orderIndex', 'ASC']],
    });

    const progress = await this.progressModel.findAll({
      where: { userId },
    });
    const progressMap = new Map(progress.map((p) => [p.questId, p]));

    return chapters.map((ch) => ({
      id: ch.id,
      slug: ch.slug,
      title: ch.title,
      subtitle: ch.subtitle,
      narrativeIntro: ch.narrativeIntro,
      rank: ch.rank,
      orderIndex: ch.orderIndex,
      requiredXp: ch.requiredXp,
      quests: ch.quests.map((q) => {
        const qp = progressMap.get(q.id);
        return {
          id: q.id,
          slug: q.slug,
          title: q.title,
          difficulty: q.difficulty,
          xpReward: q.xpReward,
          cryptoModule: q.cryptoModule,
          estimatedMinutes: q.estimatedMinutes,
          status: qp?.status || 'locked',
          score: qp?.score || 0,
        };
      }),
    }));
  }

  async getQuest(questId: string, userId: string) {
    const quest = await this.questModel.findByPk(questId, {
      include: [Chapter, Challenge],
      order: [[Challenge, 'orderIndex', 'ASC']],
    });
    if (!quest) throw new NotFoundException('Quest not found');

    const progress = await this.progressModel.findOne({
      where: { userId, questId },
    });

    return {
      id: quest.id,
      slug: quest.slug,
      title: quest.title,
      description: quest.description,
      cryptoModule: quest.cryptoModule,
      difficulty: quest.difficulty,
      xpReward: quest.xpReward,
      estimatedMinutes: quest.estimatedMinutes,
      chapter: {
        id: quest.chapter.id,
        title: quest.chapter.title,
        narrativeIntro: quest.chapter.narrativeIntro,
      },
      challenges: quest.challenges.map((c) => ({
        id: c.id,
        orderIndex: c.orderIndex,
        type: c.type,
        title: c.title,
        instruction: c.instruction,
        narrativeContext: c.narrativeContext,
        hint: c.hint,
        xpReward: c.xpReward,
        config: this.sanitizeConfig(c.config),
      })),
      status: progress?.status || 'locked',
      score: progress?.score || 0,
      attempts: progress?.attempts || 0,
      challengeData: progress?.challengeData || {},
    };
  }

  async startQuest(questId: string, userId: string) {
    const quest = await this.questModel.findByPk(questId);
    if (!quest) throw new NotFoundException('Quest not found');

    let progress = await this.progressModel.findOne({
      where: { userId, questId },
    });

    if (!progress) {
      await this.progressService.initializeQuestProgress(userId);
      progress = await this.progressModel.findOne({
        where: { userId, questId },
      });
    }

    if (progress && progress.status === 'locked') {
      throw new ForbiddenException('Quest is locked. Complete prerequisites first.');
    }

    if (progress) {
      await progress.update({
        status: 'in_progress',
        startedAt: progress.startedAt || new Date(),
        attempts: progress.attempts + 1,
      });
    } else {
      progress = await this.progressModel.create({
        userId,
        questId,
        status: 'in_progress',
        startedAt: new Date(),
        attempts: 1,
      });
    }

    return { message: 'Quest started', questId, status: 'in_progress' };
  }

  async submitChallenge(
    questId: string,
    challengeId: string,
    userId: string,
    answer: Record<string, any>,
  ) {
    const challenge = await this.challengeModel.findOne({
      where: { id: challengeId, questId },
    });
    if (!challenge) throw new NotFoundException('Challenge not found');

    const quest = await this.questModel.findByPk(questId);
    if (!quest) throw new NotFoundException('Quest not found');

    const progress = await this.progressModel.findOne({
      where: { userId, questId },
    });
    if (!progress || progress.status === 'locked') {
      throw new ForbiddenException('Start the quest first.');
    }

    const result = await this.challengeEngine.validate(
      quest.cryptoModule,
      challenge.type,
      challenge.config,
      answer,
    );

    // Update challenge data
    const challengeData = progress.challengeData || {};
    challengeData[challengeId] = {
      completed: result.correct,
      attempts: (challengeData[challengeId]?.attempts || 0) + 1,
      xpEarned: result.correct
        ? challenge.xpReward
        : challengeData[challengeId]?.xpEarned || 0,
    };
    await progress.update({ challengeData });

    // Award XP if correct
    let xpUpdate = null;
    let newAchievements = [];
    if (result.correct) {
      xpUpdate = await this.progressService.addXp(userId, challenge.xpReward);
      await this.streaksService.recordActivity(userId);

      // Check if all challenges in quest are completed
      const allChallenges = await this.challengeModel.findAll({
        where: { questId },
      });
      const allCompleted = allChallenges.every(
        (c) => challengeData[c.id]?.completed,
      );

      if (allCompleted) {
        await progress.update({
          status: 'completed',
          completedAt: new Date(),
          score: Object.values(challengeData).reduce(
            (sum: number, cd: any) => sum + (cd.xpEarned || 0),
            0,
          ),
        });

        // Award quest completion XP
        xpUpdate = await this.progressService.addXp(userId, quest.xpReward);

        // Update profile
        const profile = await this.profileModel.findOne({ where: { userId } });
        if (profile) {
          await profile.update({
            completedQuests: profile.completedQuests + 1,
          });
        }

        // Unlock next quest
        await this.progressService.unlockNextQuest(userId, questId);
      }

      // Check achievements
      newAchievements = await this.achievementsService.checkAndUnlock(userId);
    }

    return {
      ...result,
      challengeId,
      questCompleted: progress.status === 'completed',
      xpUpdate,
      newAchievements: newAchievements.map((a) => ({
        title: a.title,
        description: a.description,
        xpBonus: a.xpBonus,
      })),
    };
  }

  private sanitizeConfig(config: Record<string, any>): Record<string, any> {
    // Remove answer keys from config sent to client
    const sanitized = { ...config };
    delete sanitized.correctAnswer;
    delete sanitized.correctExplanation;
    delete sanitized.wrongExplanation;
    delete sanitized.keywords;
    delete sanitized.expectedPlaintext;
    return sanitized;
  }
}
