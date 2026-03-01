import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserProfile, QuestProgress, UserAchievement, Streak } from '../entities';

@Module({
  imports: [
    SequelizeModule.forFeature([User, UserProfile, QuestProgress, UserAchievement, Streak]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class GameUsersModule {}
