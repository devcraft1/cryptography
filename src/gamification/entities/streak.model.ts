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

@Table({ tableName: 'streaks' })
export class Streak extends Model {
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
  currentStreak: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  longestStreak: number;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  lastActivityDate: string;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => User)
  user: User;
}
