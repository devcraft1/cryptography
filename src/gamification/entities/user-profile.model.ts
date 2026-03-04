import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({ tableName: 'user_profiles' })
export class UserProfile extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  userId: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  totalXp: number;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  level: number;

  @Column({ type: DataType.STRING, defaultValue: 'Recruit' })
  rank: string;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  currentChapter: number;

  @Column({ type: DataType.STRING, allowNull: true })
  currentQuest: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  completedQuests: number;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => User)
  user: User;
}
