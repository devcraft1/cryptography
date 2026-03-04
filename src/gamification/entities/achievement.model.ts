import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  Unique,
} from 'sequelize-typescript';
import { UserAchievement } from './user-achievement.model';

@Table({ tableName: 'achievements', timestamps: false })
export class Achievement extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Unique
  @Column({ type: DataType.STRING, allowNull: false })
  slug: string;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @Column({ type: DataType.STRING, allowNull: true })
  iconUrl: string;

  @Column({
    type: DataType.ENUM('chapter', 'skill', 'streak', 'special'),
    allowNull: false,
  })
  category: string;

  @Column({ type: DataType.INTEGER, defaultValue: 50 })
  xpBonus: number;

  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: {} })
  condition: Record<string, any>;

  @HasMany(() => UserAchievement)
  userAchievements: UserAchievement[];
}
