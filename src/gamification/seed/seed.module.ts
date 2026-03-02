import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeedService } from './seed.service';
import { Chapter, Quest, Challenge, Achievement } from '../entities';

@Module({
  imports: [SequelizeModule.forFeature([Chapter, Quest, Challenge, Achievement])],
  providers: [SeedService],
})
export class SeedModule {}
