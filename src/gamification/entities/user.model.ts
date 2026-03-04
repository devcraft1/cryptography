import {
  Table,
  Column,
  Model,
  DataType,
  HasOne,
  HasMany,
  CreatedAt,
  UpdatedAt,
  Unique,
} from 'sequelize-typescript';
import { UserProfile } from './user-profile.model';
import { QuestProgress } from './quest-progress.model';
import { UserAchievement } from './user-achievement.model';
import { Streak } from './streak.model';

@Table({ tableName: 'users' })
export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Unique
  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Unique
  @Column({ type: DataType.STRING, allowNull: false })
  username: string;

  @Column({ type: DataType.STRING, allowNull: false })
  passwordHash: string;

  @Column({ type: DataType.STRING, allowNull: true })
  displayName: string;

  @Column({ type: DataType.STRING, allowNull: true })
  avatarUrl: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasOne(() => UserProfile)
  profile: UserProfile;

  @HasMany(() => QuestProgress)
  questProgress: QuestProgress[];

  @HasMany(() => UserAchievement)
  achievements: UserAchievement[];

  @HasOne(() => Streak)
  streak: Streak;
}
