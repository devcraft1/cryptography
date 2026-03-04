import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Unique,
} from 'sequelize-typescript';
import { Chapter } from './chapter.model';
import { Challenge } from './challenge.model';
import { QuestProgress } from './quest-progress.model';

@Table({ tableName: 'quests', timestamps: false })
export class Quest extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Unique
  @Column({ type: DataType.STRING, allowNull: false })
  slug: string;

  @ForeignKey(() => Chapter)
  @Column({ type: DataType.INTEGER, allowNull: false })
  chapterId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  orderIndex: number;

  @Column({ type: DataType.STRING, allowNull: false })
  cryptoModule: string;

  @Column({ type: DataType.STRING, defaultValue: 'beginner' })
  difficulty: string;

  @Column({ type: DataType.INTEGER, defaultValue: 100 })
  xpReward: number;

  @Column({ type: DataType.INTEGER, defaultValue: 10 })
  estimatedMinutes: number;

  @BelongsTo(() => Chapter)
  chapter: Chapter;

  @HasMany(() => Challenge)
  challenges: Challenge[];

  @HasMany(() => QuestProgress)
  progress: QuestProgress[];
}
