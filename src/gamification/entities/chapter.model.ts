import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  Unique,
} from 'sequelize-typescript';
import { Quest } from './quest.model';

@Table({ tableName: 'chapters', timestamps: false })
export class Chapter extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Unique
  @Column({ type: DataType.STRING, allowNull: false })
  slug: string;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING, allowNull: true })
  subtitle: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  narrativeIntro: string;

  @Column({ type: DataType.STRING, allowNull: false })
  rank: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  orderIndex: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  requiredXp: number;

  @HasMany(() => Quest)
  quests: Quest[];
}
