import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QuestsService } from './quests.service';
import { SubmitChallengeDto } from './dto/quests.dto';

@ApiTags('Game - Quests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('game')
export class QuestsController {
  constructor(private questsService: QuestsService) {}

  @Get('chapters')
  @ApiOperation({ summary: 'Get all chapters with quest progress' })
  getChapters(@Request() req) {
    return this.questsService.getChapters(req.user.id);
  }

  @Get('quests/:id')
  @ApiOperation({ summary: 'Get quest details with challenges' })
  getQuest(@Param('id') id: string, @Request() req) {
    return this.questsService.getQuest(id, req.user.id);
  }

  @Post('quests/:id/start')
  @ApiOperation({ summary: 'Start a quest' })
  startQuest(@Param('id') id: string, @Request() req) {
    return this.questsService.startQuest(id, req.user.id);
  }

  @Post('quests/:id/challenges/:cid/submit')
  @ApiOperation({ summary: 'Submit a challenge answer' })
  submitChallenge(
    @Param('id') questId: string,
    @Param('cid') challengeId: string,
    @Request() req,
    @Body() dto: SubmitChallengeDto,
  ) {
    return this.questsService.submitChallenge(
      questId,
      challengeId,
      req.user.id,
      dto.answer,
    );
  }
}
