import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StreaksService } from './streaks.service';
import { Streak } from '../entities';

@Module({
  imports: [SequelizeModule.forFeature([Streak])],
  providers: [StreaksService],
  exports: [StreaksService],
})
export class StreaksModule {}
