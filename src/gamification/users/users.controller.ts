import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@ApiTags('Game - Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('game/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getMe(@Request() req) {
    return this.usersService.getMe(req.user.id);
  }

  @Get('me/stats')
  @ApiOperation({ summary: 'Get current user stats' })
  getStats(@Request() req) {
    return this.usersService.getStats(req.user.id);
  }
}
