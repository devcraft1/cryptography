import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Achievement } from './achievement.model';

@Table({
  tableName: 'user_achievements',
  indexes: [{ unique: true, fields: ['userId', 'achievementId'] }],
})
export class UserAchievement extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  userId: string;

  @ForeignKey(() => Achievement)
  @Column({ type: DataType.UUID, allowNull: false })
  achievementId: string;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  unlockedAt: Date;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Achievement)
  achievement: Achievement;
}
