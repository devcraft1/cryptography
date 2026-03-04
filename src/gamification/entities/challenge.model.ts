import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Quest } from './quest.model';

@Table({ tableName: 'challenges', timestamps: false })
export class Challenge extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Quest)
  @Column({ type: DataType.UUID, allowNull: false })
  questId: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  orderIndex: number;

  @Column({ type: DataType.STRING, allowNull: false })
  type: string;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  instruction: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  narrativeContext: string;

  @Column({ type: DataType.STRING, allowNull: true })
  hint: string;

  @Column({ type: DataType.INTEGER, defaultValue: 25 })
  xpReward: number;

  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: {} })
  config: Record<string, any>;

  @BelongsTo(() => Quest)
  quest: Quest;
}
