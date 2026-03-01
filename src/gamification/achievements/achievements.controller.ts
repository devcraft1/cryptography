import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AchievementsService } from './achievements.service';

@ApiTags('Game - Achievements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('game/achievements')
export class AchievementsController {
  constructor(private achievementsService: AchievementsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all achievements with unlock status' })
  getAll(@Request() req) {
    return this.achievementsService.getAll(req.user.id);
  }
}
