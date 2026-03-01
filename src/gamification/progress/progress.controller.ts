import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProgressService } from './progress.service';

@ApiTags('Game - Progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('game/progress')
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get progress overview' })
  getOverview(@Request() req) {
    return this.progressService.getOverview(req.user.id);
  }
}
