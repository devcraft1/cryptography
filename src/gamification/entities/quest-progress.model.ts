import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Quest } from './quest.model';

@Table({
  tableName: 'quest_progress',
  indexes: [{ unique: true, fields: ['userId', 'questId'] }],
})
export class QuestProgress extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  userId: string;

  @ForeignKey(() => Quest)
  @Column({ type: DataType.UUID, allowNull: false })
  questId: string;

  @Column({
    type: DataType.ENUM('locked', 'available', 'in_progress', 'completed'),
    defaultValue: 'locked',
  })
  status: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  score: number;

  @Column({ type: DataType.DATE, allowNull: true })
  completedAt: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  startedAt: Date;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  attempts: number;

  @Column({ type: DataType.JSONB, allowNull: true })
  challengeData: Record<string, any>;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Quest)
  quest: Quest;
}
